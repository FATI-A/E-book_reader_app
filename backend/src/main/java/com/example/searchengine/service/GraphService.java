package com.example.searchengine.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.searchengine.model.Book;
import com.example.searchengine.repository.BookRepository;

@Service
public class GraphService {

    @Autowired
    private BookRepository bookRepository;

    /**
     * Calcule l'indice de Jaccard entre deux livres basés sur leurs top_words.
     * J(A, B) = |A ∩ B| / |A ∪ B|
     */
    public double calculateJaccard(Map<String, Integer> topA, Map<String, Integer> topB) {
        if (topA == null || topB == null || topA.isEmpty() || topB.isEmpty()) return 0.0;
        
        Set<String> setA = topA.keySet();
        Set<String> setB = topB.keySet();

        long intersectionSize = setA.stream().filter(setB::contains).count();
        long unionSize = setA.size() + setB.size() - intersectionSize;

        return unionSize == 0 ? 0 : (double) intersectionSize / unionSize;
    }

    /**
     * Met à jour les scores de centralité (PageRank simplifié).
     * On définit la centralité d'un livre comme la somme de ses similarités avec les autres.
     */
    public void updateAllPageRankScores() {
        List<Book> allBooks = bookRepository.findAll();
        int n = allBooks.size();
        
        for (Book b : allBooks) {
            double score = 0.0;
            for (Book other : allBooks) {
                if (!b.getGutenbergId().equals(other.getGutenbergId())) {
                    score += calculateJaccard(b.getTopWords(), other.getTopWords());
                }
            }
            // Normalisation par le nombre de livres
            b.setPagerankScore(score / (n - 1));
        }
        bookRepository.saveAll(allBooks);
    }
}