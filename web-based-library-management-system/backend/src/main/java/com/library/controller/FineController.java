package com.library.controller;
import com.library.dto.ApiResponse;
import com.library.exception.AppException;
import com.library.model.Fine;
import com.library.repository.FineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fines")
@CrossOrigin(origins="*")
public class FineController {
    @Autowired FineRepository repo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Fine>>> getAll(@RequestParam(required=false) String status) {
        List<Fine> list = (status!=null&&!status.isBlank()) ? repo.findByStatusContainingIgnoreCase(status) : repo.findAll();
        return ResponseEntity.ok(ApiResponse.ok("OK", list));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Fine>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("OK", repo.findById(id).orElseThrow(()->new AppException(404,"Fine not found"))));
    }
    @PostMapping
    public ResponseEntity<ApiResponse<Fine>> create(@RequestBody Fine f) {
        if(f.getMemberName()==null||f.getMemberName().isBlank()) throw new AppException(400,"Member name is required");
        if(f.getBookTitle()==null||f.getBookTitle().isBlank()) throw new AppException(400,"Book title is required");
        if(f.getDueDate()==null) throw new AppException(400,"Due date is required");
        if(f.getReturnDate()==null) throw new AppException(400,"Return date is required");
        long late = ChronoUnit.DAYS.between(f.getDueDate(), f.getReturnDate());
        f.setLateDays((int)Math.max(0,late));
        double perDay = f.getFinePerDay()!=null ? f.getFinePerDay() : 10.0;
        f.setFinePerDay(perDay);
        f.setTotalFine(f.getLateDays()*perDay);
        f.setStatus(f.getLateDays()>0 ? "UNPAID" : "PAID");
        return ResponseEntity.status(201).body(ApiResponse.ok("Fine created", repo.save(f)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Fine>> update(@PathVariable Long id, @RequestBody Fine f) {
        Fine ex = repo.findById(id).orElseThrow(()->new AppException(404,"Fine not found"));
        if(f.getStatus()!=null&&!f.getStatus().isBlank()) ex.setStatus(f.getStatus());
        if(f.getNotes()!=null) ex.setNotes(f.getNotes());
        if(f.getFinePerDay()!=null) { ex.setFinePerDay(f.getFinePerDay()); ex.setTotalFine(ex.getLateDays()*f.getFinePerDay()); }
        return ResponseEntity.ok(ApiResponse.ok("Fine updated", repo.save(ex)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        repo.findById(id).orElseThrow(()->new AppException(404,"Fine not found"));
        repo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Fine deleted", null));
    }
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String,Object>>> stats() {
        List<Fine> all = repo.findAll();
        double totalAmount = all.stream().mapToDouble(f->f.getTotalFine()!=null?f.getTotalFine():0).sum();
        double paidAmount = repo.findByStatusContainingIgnoreCase("PAID").stream().mapToDouble(f->f.getTotalFine()!=null?f.getTotalFine():0).sum();
        return ResponseEntity.ok(ApiResponse.ok("OK", Map.of(
            "total", (long)all.size(),
            "unpaid", (long)repo.findByStatusContainingIgnoreCase("UNPAID").size(),
            "paid", (long)repo.findByStatusContainingIgnoreCase("PAID").size(),
            "totalAmount", totalAmount,
            "paidAmount", paidAmount
        )));
    }
}
