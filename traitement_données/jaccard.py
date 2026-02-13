import psycopg2
from psycopg2.extras import execute_values
import json
import itertools

DB_PARAMS = {
    "host": "localhost",
    "port": "5432",
    "database": "bibliotheque_db",
    "user": "user_admin",
    "password": "password_projet"
}

def calculate_jaccard(set_a, set_b):
    intersection = len(set_a.intersection(set_b))
    union = len(set_a.union(set_b))
    return intersection / union if union > 0 else 0

def fill_jaccard_links():
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()
    
    print("📥 Extraction des mots-clés de la base...")
    cur.execute("SELECT gutenberg_id, top_words FROM books;")
    rows = cur.fetchall()
    
    # On transforme le JSON en Set Python pour des calculs ultra-rapides
    books_data = []
    for book_id, top_words_raw in rows:
        words_dict = top_words_raw if isinstance(top_words_raw, dict) else json.loads(top_words_raw)
        books_data.append({
            "id": book_id,
            "word_set": set(words_dict.keys())
        })

    print(f"⚖️ Calcul de similarité pour {len(books_data)} livres...")
    links = []
    threshold = 0.1  # On ne garde que les liens au-dessus de 10% de similarité
    
    # itertools.combinations évite de comparer A-B et B-A (on divise le travail par 2)
    for book_a, book_b in itertools.combinations(books_data, 2):
        score = calculate_jaccard(book_a["word_set"], book_b["word_set"])
        
        if score >= threshold:
            links.append((book_a["id"], book_b["id"], score))
            # On stocke aussi le lien inverse pour faciliter les requêtes SQL (bidirectionnel)
            links.append((book_b["id"], book_a["id"], score))

        if len(links) >= 10000:
            execute_values(cur, "INSERT INTO jaccard_links (book_id_1, book_id_2, similarity) VALUES %s ON CONFLICT DO NOTHING", links)
            links = []

    if links:
        execute_values(cur, "INSERT INTO jaccard_links (book_id_1, book_id_2, similarity) VALUES %s ON CONFLICT DO NOTHING", links)

    conn.commit()
    print(f"✅ Graphe de Jaccard construit !")
    cur.close()
    conn.close()

if __name__ == "__main__":
    fill_jaccard_links()