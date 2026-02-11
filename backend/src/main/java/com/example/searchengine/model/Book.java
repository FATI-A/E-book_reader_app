package com.example.searchengine.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.Map;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private Integer gutenbergId;

    @Column(columnDefinition = "TEXT") // Changement ici
    private String title;

    @Column(columnDefinition = "TEXT") // Changement ici
    private String authors;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT") // Changement ici
    private String imageUrl;

    @Column(columnDefinition = "TEXT") // Changement ici
    private String categories;

    private Integer downloadCount;
    private String language;
    private Integer wordCount;

    @Column(columnDefinition = "TEXT") // Changement ici
    private String textUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "top_words", columnDefinition = "jsonb")
    private Map<String, Integer> topWords;

    private Double pagerankScore = 0.0;
}