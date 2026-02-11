package com.example.searchengine.model;

import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inverted_index")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvertedIndex {
    @Id
    private String word;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "books_map", columnDefinition = "jsonb")
    private Map<String, Integer> booksMap; // ClÃ©: ID livre, Valeur: Occurrences

    private Integer totalDocs;
}