package com.library.controller;
import com.library.dto.ApiResponse;
import com.library.exception.AppException;
import com.library.model.Reservation;
import com.library.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins="*")
public class ReservationController {
    @Autowired ReservationRepository repo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Reservation>>> getAll(@RequestParam(required=false) String status) {
        // Auto mark overdue
        repo.findAll().forEach(r -> {
            if(("PENDING".equals(r.getStatus())||"CONFIRMED".equals(r.getStatus())) &&
                r.getDueDate()!=null && !r.getDueDate().isAfter(LocalDate.now())) {
                r.setStatus("OVERDUE"); repo.save(r);
            }
        });
        List<Reservation> list = (status!=null&&!status.isBlank()) ? repo.findByStatusContainingIgnoreCase(status) : repo.findAll();
        return ResponseEntity.ok(ApiResponse.ok("OK", list));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Reservation>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("OK", repo.findById(id).orElseThrow(()->new AppException(404,"Reservation not found"))));
    }
    @PostMapping
    public ResponseEntity<ApiResponse<Reservation>> create(@RequestBody Reservation r) {
        if(r.getMemberName()==null||r.getMemberName().isBlank()) throw new AppException(400,"Member name is required");
        if(r.getMemberEmail()==null||!r.getMemberEmail().contains("@")) throw new AppException(400,"Valid email is required");
        if(r.getBookTitle()==null||r.getBookTitle().isBlank()) throw new AppException(400,"Book title is required");
        if(r.getIsbn()==null||r.getIsbn().isBlank()) throw new AppException(400,"ISBN is required");
        if(r.getAuthor()==null||r.getAuthor().isBlank()) throw new AppException(400,"Author is required");
        if(r.getDueDate()==null) throw new AppException(400,"Due date is required");
        if(!r.getDueDate().isAfter(LocalDate.now())) throw new AppException(400,"Due date must be future");
        r.setStatus("PENDING");
        return ResponseEntity.status(201).body(ApiResponse.ok("Reservation created", repo.save(r)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Reservation>> update(@PathVariable Long id, @RequestBody Reservation r) {
        Reservation ex = repo.findById(id).orElseThrow(()->new AppException(404,"Reservation not found"));
        if(r.getMemberName()!=null&&!r.getMemberName().isBlank()) ex.setMemberName(r.getMemberName());
        if(r.getMemberEmail()!=null&&!r.getMemberEmail().isBlank()) ex.setMemberEmail(r.getMemberEmail());
        if(r.getBookTitle()!=null&&!r.getBookTitle().isBlank()) ex.setBookTitle(r.getBookTitle());
        if(r.getIsbn()!=null&&!r.getIsbn().isBlank()) ex.setIsbn(r.getIsbn());
        if(r.getAuthor()!=null&&!r.getAuthor().isBlank()) ex.setAuthor(r.getAuthor());
        if(r.getDueDate()!=null) ex.setDueDate(r.getDueDate());
        if(r.getStatus()!=null&&!r.getStatus().isBlank()) ex.setStatus(r.getStatus());
        if(r.getNotes()!=null) ex.setNotes(r.getNotes());
        return ResponseEntity.ok(ApiResponse.ok("Reservation updated", repo.save(ex)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        repo.findById(id).orElseThrow(()->new AppException(404,"Reservation not found"));
        repo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Reservation deleted", null));
    }
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String,Long>>> stats() {
        return ResponseEntity.ok(ApiResponse.ok("OK", Map.of(
            "total", repo.count(),
            "pending", repo.findByStatusContainingIgnoreCase("PENDING").stream().count(),
            "confirmed", repo.findByStatusContainingIgnoreCase("CONFIRMED").stream().count(),
            "overdue", repo.findByStatusContainingIgnoreCase("OVERDUE").stream().count()
        )));
    }
}
