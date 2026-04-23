package com.library.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name="users")
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    @Column(nullable=false, unique=true) private String email;
    @Column(nullable=false) private String phone;
    @Column(nullable=false) private String role; // STUDENT, LECTURER, STAFF
    @Column(nullable=false) private String status = "ACTIVE"; // ACTIVE, INACTIVE
    @Column private String address;
    @Column(updatable=false) private LocalDateTime createdAt;
    @Column private LocalDateTime updatedAt;
    @PrePersist protected void onCreate() { createdAt=LocalDateTime.now(); updatedAt=LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt=LocalDateTime.now(); }

    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getName(){return name;} public void setName(String v){this.name=v;}
    public String getEmail(){return email;} public void setEmail(String v){this.email=v;}
    public String getPhone(){return phone;} public void setPhone(String v){this.phone=v;}
    public String getRole(){return role;} public void setRole(String v){this.role=v;}
    public String getStatus(){return status;} public void setStatus(String v){this.status=v;}
    public String getAddress(){return address;} public void setAddress(String v){this.address=v;}
    public LocalDateTime getCreatedAt(){return createdAt;}
    public LocalDateTime getUpdatedAt(){return updatedAt;}
}
