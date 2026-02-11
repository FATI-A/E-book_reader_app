package com.example.searchengine.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.searchengine.model.Book;
import com.example.searchengine.repository.BookRepository;
import com.example.searchengine.service.GraphService;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*") 
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @GetMapping("/search")
    public List<Book> search(@RequestParam String keyword) {
        return bookRepository.searchByKeyword(keyword.toLowerCase().trim());
    }

    @GetMapping("/search-regex")
    public List<Book> searchRegex(@RequestParam String expression) {
        return bookRepository.searchByRegex(expression);
    }

    @GetMapping("/{id}")
    public Book getBook(@PathVariable Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    @GetMapping("/popular")
    public List<Book> getPopular() {
        List<Book> topBooks = bookRepository.findTopDownloadedBooks();
        return topBooks;
    }

    @Autowired
    private GraphService graphService;

    @PostMapping("/recalculate-centralities")
    public void recalculateCentralities() {
        graphService.updateAllPageRankScores();
    }

    @GetMapping("/top-categories")
    public List<Object[]> getTopCategories() {
        return bookRepository.findTopCategories();
    }

    @GetMapping("/category/{name}")
    public List<Book> getBooksByCategory(@PathVariable String name) {
        return bookRepository.findTopBooksByCategory(name);
    }

    @GetMapping("/{gutenbergId}/suggestions")
    public List<Book> getSuggestions(@PathVariable Integer gutenbergId) {
        return bookRepository.findSuggestionsByGutenbergId(gutenbergId);
    }

    @GetMapping("/all")
    public Page<Book> getAllBooks(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return bookRepository.findAllCustom(PageRequest.of(page, size, Sort.by("pagerank_score").descending()));
    }
}