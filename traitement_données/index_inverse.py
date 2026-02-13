import psycopg2
from psycopg2.extras import execute_values
import json
from collections import defaultdict

DB_PARAMS = {
    "host": "localhost",
    "port": "5432",
    "database": "bibliotheque_db",
    "user": "user_admin",
    "password": "password_projet"
}

def fill_json_index():
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()
    
    print("🚀 Lecture de la table 'books'...")
    cur.execute("SELECT gutenberg_id, top_words FROM books;")
    rows = cur.fetchall()
    
    master_index = defaultdict(dict)

    for book_id, top_words_raw in rows:
        words_dict = top_words_raw if isinstance(top_words_raw, dict) else json.loads(top_words_raw)
        
        for word, count in words_dict.items():
            if len(word) > 2 and not word.isdigit():
                master_index[word][str(book_id)] = count

    print(f"📦 Préparation de l'insertion pour {len(master_index)} mots uniques...")

    final_data = [
        (word, json.dumps(map_data), len(map_data)) 
        for word, map_data in master_index.items()
    ]

    try:
        cur.execute("TRUNCATE inverted_index;")
        
        batch_size = 10000
        for i in range(0, len(final_data), batch_size):
            batch = final_data[i : i + batch_size]
            execute_values(
                cur, 
                "INSERT INTO inverted_index (word, books_map, total_docs) VALUES %s", 
                batch
            )
            if i % 50000 == 0:
                print(f"⏳ {i} / {len(final_data)} mots insérés...")

        conn.commit()
        print("✅ Index inversé JSONB créé avec succès !")
    except Exception as e:
        print(f"Erreur lors de l'insertion : {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    fill_json_index()