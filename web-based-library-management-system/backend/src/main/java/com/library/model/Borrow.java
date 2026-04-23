package com.library.model;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name="borrows")
public class Borrow {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private Long userId;
    @Column(nullable=false) private String memberName;
    @Column(nullable=false) private Long bookId;
    @Column(nullable=false) private String bookTitle;
    @Column(nullable=false) private LocalDate borrowDate;
    @Column(nullable=false) private LocalDate dueDate;
    @Column private String status = "BORROWED"; // BORROWED, RETURNED, OVERDUE
    @Column private String notes;
    @Column(updatable=false) private LocalDateTime createdAt;
    @Column private LocalDateTime updatedAt;
    @PrePersist protected void onCreate(){if(borrowDate==null)borrowDate=LocalDate.now();createdAt=LocalDateTime.now();updatedAt=LocalDateTime.now();}
    @PreUpdate protected void onUpdate(){updatedAt=LocalDateTime.now();}

    public Long getId(){return id;} public void setId(Long v){this.id=v;}
    public Long getUserId(){return userId;} public void setUserId(Long v){this.userId=v;}
    public String getMemberName(){return memberName;} public void setMemberName(String v){this.memberName=v;}
    public Long getBookId(){return bookId;} public void setBookId(Long v){this.bookId=v;}
    public String getBookTitle(){return bookTitle;} public void setBookTitle(String v){this.bookTitle=v;}
    public LocalDate getBorrowDate(){return borrowDate;} public void setBorrowDate(LocalDate v){this.borrowDate=v;}
    public LocalDate getDueDate(){return dueDate;} public void setDueDate(LocalDate v){this.dueDate=v;}
    public String getStatus(){return status;} public void setStatus(String v){this.status=v;}
    public String getNotes(){return notes;} public void setNotes(String v){this.notes=v;}
    public LocalDateTime getCreatedAt(){return createdAt;}
    public LocalDateTime getUpdatedAt(){return updatedAt;}
}
