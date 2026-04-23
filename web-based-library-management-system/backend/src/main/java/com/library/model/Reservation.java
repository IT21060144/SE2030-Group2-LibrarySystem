package com.library.model;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name="reservations")
public class Reservation {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String memberName;
    @Column(nullable=false) private String memberEmail;
    @Column(nullable=false) private String bookTitle;
    @Column(nullable=false) private String isbn;
    @Column(nullable=false) private String author;
    @Column private LocalDate reservationDate;
    @Column(nullable=false) private LocalDate dueDate;
    @Column private String status = "PENDING"; // PENDING,CONFIRMED,CANCELLED,COMPLETED,OVERDUE
    @Column private String notes;
    @Column(updatable=false) private LocalDateTime createdAt;
    @Column private LocalDateTime updatedAt;
    @PrePersist protected void onCreate(){if(reservationDate==null)reservationDate=LocalDate.now();createdAt=LocalDateTime.now();updatedAt=LocalDateTime.now();}
    @PreUpdate protected void onUpdate(){updatedAt=LocalDateTime.now();}

    public Long getId(){return id;} public void setId(Long v){this.id=v;}
    public String getMemberName(){return memberName;} public void setMemberName(String v){this.memberName=v;}
    public String getMemberEmail(){return memberEmail;} public void setMemberEmail(String v){this.memberEmail=v;}
    public String getBookTitle(){return bookTitle;} public void setBookTitle(String v){this.bookTitle=v;}
    public String getIsbn(){return isbn;} public void setIsbn(String v){this.isbn=v;}
    public String getAuthor(){return author;} public void setAuthor(String v){this.author=v;}
    public LocalDate getReservationDate(){return reservationDate;} public void setReservationDate(LocalDate v){this.reservationDate=v;}
    public LocalDate getDueDate(){return dueDate;} public void setDueDate(LocalDate v){this.dueDate=v;}
    public String getStatus(){return status;} public void setStatus(String v){this.status=v;}
    public String getNotes(){return notes;} public void setNotes(String v){this.notes=v;}
    public LocalDateTime getCreatedAt(){return createdAt;}
    public LocalDateTime getUpdatedAt(){return updatedAt;}
}
