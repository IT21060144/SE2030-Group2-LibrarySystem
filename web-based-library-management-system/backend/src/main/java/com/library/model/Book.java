package com.library.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name="books")
public class Book {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String title;
    @Column(nullable=false) private String author;
    @Column(nullable=false) private String isbn;
    @Column private String category;
    @Column private String publisher;
    @Column private Integer quantity = 1;
    @Column private Integer available = 1;
    @Column private String status = "AVAILABLE"; // AVAILABLE, UNAVAILABLE
    @Column(updatable=false) private LocalDateTime createdAt;
    @Column private LocalDateTime updatedAt;
    @PrePersist protected void onCreate(){createdAt=LocalDateTime.now();updatedAt=LocalDateTime.now();}
    @PreUpdate protected void onUpdate(){updatedAt=LocalDateTime.now();}

    public Long getId(){return id;} public void setId(Long v){this.id=v;}
    public String getTitle(){return title;} public void setTitle(String v){this.title=v;}
    public String getAuthor(){return author;} public void setAuthor(String v){this.author=v;}
    public String getIsbn(){return isbn;} public void setIsbn(String v){this.isbn=v;}
    public String getCategory(){return category;} public void setCategory(String v){this.category=v;}
    public String getPublisher(){return publisher;} public void setPublisher(String v){this.publisher=v;}
    public Integer getQuantity(){return quantity;} public void setQuantity(Integer v){this.quantity=v;}
    public Integer getAvailable(){return available;} public void setAvailable(Integer v){this.available=v;}
    public String getStatus(){return status;} public void setStatus(String v){this.status=v;}
    public LocalDateTime getCreatedAt(){return createdAt;}
    public LocalDateTime getUpdatedAt(){return updatedAt;}
}
