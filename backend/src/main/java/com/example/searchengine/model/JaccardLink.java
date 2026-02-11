package com.example.searchengine.model;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
class JaccardLinkId implements Serializable {
    private Integer bookId1;
    private Integer bookId2;
}

@Entity
@Table(name = "jaccard_links")
@IdClass(JaccardLinkId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JaccardLink {
    @Id
    private Integer bookId1;
    @Id
    private Integer bookId2;
    private Double similarity;
}