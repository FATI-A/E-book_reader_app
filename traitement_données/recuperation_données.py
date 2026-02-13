import requests
import re
import psycopg2
import json
from collections import Counter
import time

NB_LIVRES_TARGET = 1664
NB_WORDS_MIN = 10000 
NB_TOP_WORDS = 10000  

DB_PARAMS = {
    "host": "localhost",
    "port": "5432",
    "database": "bibliotheque_db",
    "user": "user_admin",
    "password": "password_projet"
}

MAX_API_RETRIES = 5     
RETRY_SLEEP_SEC = 5     

def extract_top_words(text, top_n=NB_TOP_WORDS):
    words = re.findall(r'\b\w{2,}\b', text.lower())
    return dict(Counter(words).most_common(top_n))

def get_text_url(formats):
    for key, value in formats.items():
        if key.startswith("text/plain"):
            return value
    return None

def save_many_to_db(list_of_books):
    if not list_of_books:
        return
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()
    try:
        insert_query = """
            INSERT INTO books (
                gutenberg_id, title, authors, description, image_url, 
                categories, download_count, language, word_count, text_url, top_words
            )
            VALUES %s
            ON CONFLICT (gutenberg_id) DO NOTHING;
        """
        from psycopg2.extras import execute_values
        values = [
            (
                b["id"], b["title"], ", ".join(b["authors"]),
                b["description"], b["image_url"], ", ".join(b["categories"]),
                b["download_count"], b["language"], b["word_count"],
                b["text_url"], json.dumps(b["top_words"]),
            )
            for b in list_of_books
        ]
        execute_values(cur, insert_query, values)
        conn.commit()
    except Exception as e:
        print(f"Erreur DB batch : {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

def resilient_get_json(url, retries=MAX_API_RETRIES):
    for i in range(retries):
        try:
            return requests.get(url, timeout=15).json()
        except Exception as e:
            print(f"Erreur requête API (tentative {i+1}/{retries}): {e}")
            if i < retries - 1:
                time.sleep(RETRY_SLEEP_SEC)
    return None  # Si ça échoue toujours

def main():
    livres_inseres = 0
    next_url = "https://gutendex.com/books/"
    batch = []
    BATCH_SIZE = 20

    seen_ids = set() 

    while livres_inseres < NB_LIVRES_TARGET and next_url:
        print(f"--- Requête API : {next_url} ---")
        res = resilient_get_json(next_url)
        if not res:
            print(f"Impossible d’obtenir la page {next_url}, tentative de passer à la suivante.")
            match = re.search(r"page=(\d+)", next_url)
            if match:
                page_num = int(match.group(1)) + 1
                next_url = re.sub(r"page=(\d+)", f"page={page_num}", next_url)
            else:
                break
            continue

        for book in res.get('results', []):
            if livres_inseres + len(batch) >= NB_LIVRES_TARGET:
                break
            if book['id'] in seen_ids:
                continue
            seen_ids.add(book['id'])

            url_txt = get_text_url(book.get('formats', {}))
            url_img = book.get('formats', {}).get('image/jpeg')
            if not url_txt:
                continue

            try:
                response = requests.get(url_txt, timeout=15)
                full_text = response.text
                nb_mots = len(full_text.split())
            except Exception as e:
                print(f"Erreur téléchargement du texte (ID {book['id']}): {e}")
                continue

            if nb_mots < NB_WORDS_MIN:
                continue

            top_words = extract_top_words(full_text)
            cats = [b.replace("Category: ", "") for b in book.get('bookshelves', []) if "Category" in b]
            if not cats:
                cats = book.get('subjects', [])[:3]

            data = {
                "id": book['id'],
                "title": book['title'],
                "authors": [a['name'] for a in book['authors']],
                "description": book.get('summaries', [""])[0] if book.get('summaries') else "",
                "image_url": url_img,
                "categories": cats,
                "download_count": book.get('download_count', 0),
                "language": book['languages'][0] if book.get('languages') else "en",
                "word_count": nb_mots,
                "text_url": url_txt,
                "top_words": top_words
            }
            batch.append(data)
            if len(batch) >= BATCH_SIZE:
                save_many_to_db(batch)
                livres_inseres += len(batch)
                for b in batch:
                    print(f"✅ [{livres_inseres}] Ajouté : {b['title']}")
                batch = []

        next_url = res.get('next')

    if batch:
        save_many_to_db(batch)
        for b in batch:
            livres_inseres += 1
            print(f"[{livres_inseres}] Ajouté : {b['title']}")

if __name__ == "__main__":
    main()