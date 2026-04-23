package com.library.controller;
import com.library.dto.ApiResponse;
import com.library.exception.AppException;
import com.library.model.Borrow;
import com.library.repository.BorrowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrows")
@CrossOrigin(origins="*")
public class BorrowController {
    @Autowired BorrowRepository repo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Borrow>>> getAll(@RequestParam(required=false) String status) {
        List<Borrow> list = (status!=null&&!status.isBlank()) ? repo.findByStatusContainingIgnoreCase(status) : repo.findAll();
        return ResponseEntity.ok(ApiResponse.ok("OK", list));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Borrow>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("OK", repo.findById(id).orElseThrow(()->new AppException(404,"Borrow not found"))));
    }
    @PostMapping
    public ResponseEntity<ApiResponse<Borrow>> create(@RequestBody Borrow b) {
        if(b.getMemberName()==null||b.getMemberName().isBlank()) throw new AppException(400,"Member name is required");
        if(b.getBookTitle()==null||b.getBookTitle().isBlank()) throw new AppException(400,"Book title is required");
        if(b.getDueDate()==null) throw new AppException(400,"Due date is required");
        if(!b.getDueDate().isAfter(LocalDate.now())) throw new AppException(400,"Due date must be future");
        b.setStatus("BORROWED");
        return ResponseEntity.status(201).body(ApiResponse.ok("Borrow created", repo.save(b)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Borrow>> update(@PathVariable Long id, @RequestBody Borrow b) {
        Borrow ex = repo.findById(id).orElseThrow(()->new AppException(404,"Borrow not found"));
        if(b.getMemberName()!=null&&!b.getMemberName().isBlank()) ex.setMemberName(b.getMemberName());
        if(b.getBookTitle()!=null&&!b.getBookTitle().isBlank()) ex.setBookTitle(b.getBookTitle());
        if(b.getDueDate()!=null) ex.setDueDate(b.getDueDate());
        if(b.getStatus()!=null&&!b.getStatus().isBlank()) ex.setStatus(b.getStatus());
        if(b.getNotes()!=null) ex.setNotes(b.getNotes());
        return ResponseEntity.ok(ApiResponse.ok("Borrow updated", repo.save(ex)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        repo.findById(id).orElseThrow(()->new AppException(404,"Borrow not found"));
        repo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Borrow deleted", null));
    }
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String,Long>>> stats() {
        return ResponseEntity.ok(ApiResponse.ok("OK", Map.of(
            "total", repo.count(),
            "borrowed", repo.findByStatusContainingIgnoreCase("BORROWED").stream().count(),
            "returned", repo.findByStatusContainingIgnoreCase("RETURNED").stream().count(),
            "overdue", repo.findByStatusContainingIgnoreCase("OVERDUE").stream().count()
        )));
    }
}
