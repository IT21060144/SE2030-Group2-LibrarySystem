package com.library.model;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name="fines")
public class Fine {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private Long borrowId;
    @Column(nullable=false) private String memberName;
    @Column(nullable=false) private String bookTitle;
    @Column(nullable=false) private LocalDate dueDate;
    @Column(nullable=false) private LocalDate returnDate;
    @Column(nullable=false) private Integer lateDays;
    @Column(nullable=false) private Double finePerDay = 10.0;
    @Column(nullable=false) private Double totalFine;
    @Column private String status = "UNPAID"; // UNPAID, PAID
    @Column private String notes;
    @Column(updatable=false) private LocalDateTime createdAt;
    @Column private LocalDateTime updatedAt;
    @PrePersist protected void onCreate(){createdAt=LocalDateTime.now();updatedAt=LocalDateTime.now();}
    @PreUpdate protected void onUpdate(){updatedAt=LocalDateTime.now();}

    public Long getId(){return id;} public void setId(Long v){this.id=v;}
    public Long getBorrowId(){return borrowId;} public void setBorrowId(Long v){this.borrowId=v;}
    public String getMemberName(){return memberName;} public void setMemberName(String v){this.memberName=v;}
    public String getBookTitle(){return bookTitle;} public void setBookTitle(String v){this.bookTitle=v;}
    public LocalDate getDueDate(){return dueDate;} public void setDueDate(LocalDate v){this.dueDate=v;}
    public LocalDate getReturnDate(){return returnDate;} public void setReturnDate(LocalDate v){this.returnDate=v;}
    public Integer getLateDays(){return lateDays;} public void setLateDays(Integer v){this.lateDays=v;}
    public Double getFinePerDay(){return finePerDay;} public void setFinePerDay(Double v){this.finePerDay=v;}
    public Double getTotalFine(){return totalFine;} public void setTotalFine(Double v){this.totalFine=v;}
    public String getStatus(){return status;} public void setStatus(String v){this.status=v;}
    public String getNotes(){return notes;} public void setNotes(String v){this.notes=v;}
    public LocalDateTime getCreatedAt(){return createdAt;}
    public LocalDateTime getUpdatedAt(){return updatedAt;}
}
