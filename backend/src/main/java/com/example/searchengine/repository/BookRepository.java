package com.example.searchengine.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.searchengine.model.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    String COLUMNS = "b.id, b.gutenberg_id, b.title, b.authors, b.description, b.image_url, b.categories, b.download_count, b.language, b.word_count, b.text_url, b.pagerank_score, NULL AS top_words";

    /**
     * UC1 : Recherche Simple
     * Utilise jsonb_exists pour vérifier si l'ID du livre est une clé dans la map du mot.
     */
       @Query(value = "SELECT " + COLUMNS + " FROM books b " +
              "JOIN inverted_index i ON jsonb_exists(i.books_map, CAST(b.gutenberg_id AS text)) " +
              "WHERE i.word = :keyword " +
              "ORDER BY " +
              "  (CASE WHEN b.title ILIKE %:keyword% THEN 1 ELSE 0 END) DESC, " + // Title match first
              "  b.pagerank_score DESC", // Then PageRank
              nativeQuery = true)
       List<Book> searchByKeyword(@Param("keyword") String keyword);

    /**
     * UC2 : Recherche Avancée (RegEx)
     * On utilise subquery pour éviter l'erreur de jointure sur fonction.
     */
       @Query(value = "SELECT " + COLUMNS + " FROM books b " +
              "WHERE b.gutenberg_id IN (" +
              "  SELECT CAST(jsonb_object_keys(i.books_map) AS INTEGER) " +
              "  FROM inverted_index i " +
              "  WHERE i.word ~* :regex" +
              ") " +
              "ORDER BY " +
              "  (CASE WHEN b.title ~* :regex THEN 1 ELSE 0 END) DESC, " +
              "  b.pagerank_score DESC",
              nativeQuery = true)
       List<Book> searchByRegex(@Param("regex") String regex);

    @Query(value = "SELECT " + COLUMNS + " FROM books b ORDER BY b.download_count DESC LIMIT 15", nativeQuery = true)
    List<Book> findTopDownloadedBooks();

    /**
     * Récupère les 10 catégories les plus présentes dans la base.
     * Utilise unnest et string_to_array pour transformer la chaîne "Cat1, Cat2" en lignes exploitables.
     */
    @Query(value = """
        SELECT category, COUNT(*) as count 
        FROM (
            SELECT unnest(string_to_array(b.categories, ', ')) as category 
            FROM books b
        ) sub 
        WHERE category != '' 
        GROUP BY category 
        ORDER BY count DESC 
        LIMIT 20
        """, nativeQuery = true)
    List<Object[]> findTopCategories();

    /**
     * Récupère les 10 livres les plus téléchargés pour une catégorie donnée.
     */
    @Query(value = "SELECT " + COLUMNS + " FROM books b " +
           "WHERE b.categories ILIKE %:category% " +
           "ORDER BY b.download_count DESC " +
           "LIMIT 20", nativeQuery = true)
    List<Book> findTopBooksByCategory(@Param("category") String category);

/**
     * UC : Suggestions par voisinage direct (Graphe de Jaccard)
     * Trouve les livres qui ont un indice de Jaccard élevé avec le livre donné.
     */
    @Query(value = "SELECT " + COLUMNS + " FROM books b " +
           "WHERE b.gutenberg_id IN (" +
           "  SELECT CASE WHEN book_id_1 = :id THEN book_id_2 ELSE book_id_1 END " +
           "  FROM jaccard_links " +
           "  WHERE book_id_1 = :id OR book_id_2 = :id" +
           ") " +
           "ORDER BY b.pagerank_score DESC " +
           "LIMIT 5", nativeQuery = true)
    List<Book> findNeighborsByJaccard(@Param("id") Integer id);

    /**
     * Récupère les suggestions basées sur le graphe de Jaccard.
     * On cherche les voisins du livre {gutenbergId} dans la table jaccard_links.
     */
    @Query(value = """
        SELECT b.id, b.gutenberg_id, b.title, b.authors, b.description, b.image_url, 
               b.categories, b.download_count, b.language, b.word_count, b.text_url, 
               b.pagerank_score, NULL AS top_words 
        FROM books b
        JOIN jaccard_links j ON (b.gutenberg_id = j.book_id_2)
        WHERE j.book_id_1 = :gutenbergId
        ORDER BY b.pagerank_score DESC
        LIMIT 10
        """, nativeQuery = true)
    List<Book> findSuggestionsByGutenbergId(@Param("gutenbergId") Integer gutenbergId);

    @Query(value = "SELECT " + COLUMNS + " FROM books b", 
       countQuery = "SELECT count(*) FROM books", 
       nativeQuery = true)
       Page<Book> findAllCustom(Pageable pageable);

}