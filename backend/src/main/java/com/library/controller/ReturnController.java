package com.library.controller;
import com.library.dto.ApiResponse;
import com.library.exception.AppException;
import com.library.model.Return;
import com.library.repository.ReturnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/returns")
@CrossOrigin(origins="*")
public class ReturnController {
    @Autowired ReturnRepository repo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Return>>> getAll(@RequestParam(required=false) String status) {
        List<Return> list = (status!=null&&!status.isBlank()) ? repo.findByStatusContainingIgnoreCase(status) : repo.findAll();
        return ResponseEntity.ok(ApiResponse.ok("OK", list));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Return>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("OK", repo.findById(id).orElseThrow(()->new AppException(404,"Return not found"))));
    }
    @PostMapping
    public ResponseEntity<ApiResponse<Return>> create(@RequestBody Return r) {
        if(r.getMemberName()==null||r.getMemberName().isBlank()) throw new AppException(400,"Member name is required");
        if(r.getBookTitle()==null||r.getBookTitle().isBlank()) throw new AppException(400,"Book title is required");
        if(r.getDueDate()==null) throw new AppException(400,"Due date is required");
        if(r.getReturnDate()==null) r.setReturnDate(LocalDate.now());
        // Calculate late days and fine
        long lateDays = ChronoUnit.DAYS.between(r.getDueDate(), r.getReturnDate());
        if(lateDays>0) {
            r.setLateDays((int)lateDays);
            r.setFine(lateDays * 10.0);
            r.setStatus("FINE_PENDING");
        } else {
            r.setLateDays(0); r.setFine(0.0); r.setStatus("RETURNED");
        }
        return ResponseEntity.status(201).body(ApiResponse.ok("Return recorded", repo.save(r)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Return>> update(@PathVariable Long id, @RequestBody Return r) {
        Return ex = repo.findById(id).orElseThrow(()->new AppException(404,"Return not found"));
        if(r.getStatus()!=null&&!r.getStatus().isBlank()) ex.setStatus(r.getStatus());
        if(r.getNotes()!=null) ex.setNotes(r.getNotes());
        if(r.getFine()!=null) ex.setFine(r.getFine());
        return ResponseEntity.ok(ApiResponse.ok("Return updated", repo.save(ex)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        repo.findById(id).orElseThrow(()->new AppException(404,"Return not found"));
        repo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Return deleted", null));
    }
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String,Long>>> stats() {
        return ResponseEntity.ok(ApiResponse.ok("OK", Map.of(
            "total", repo.count(),
            "returned", repo.findByStatusContainingIgnoreCase("RETURNED").stream().count(),
            "fine_pending", repo.findByStatusContainingIgnoreCase("FINE_PENDING").stream().count(),
            "fine_paid", repo.findByStatusContainingIgnoreCase("FINE_PAID").stream().count()
        )));
    }
}
