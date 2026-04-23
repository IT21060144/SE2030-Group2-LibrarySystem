package com.library.controller;
import com.library.dto.ApiResponse;
import com.library.exception.AppException;
import com.library.model.Book;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins="*")
public class BookController {
    @Autowired BookRepository repo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Book>>> getAll(@RequestParam(required=false) String status) {
        List<Book> list = (status!=null&&!status.isBlank()) ? repo.findByStatusContainingIgnoreCase(status) : repo.findAll();
        return ResponseEntity.ok(ApiResponse.ok("OK", list));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Book>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("OK", repo.findById(id).orElseThrow(()->new AppException(404,"Book not found"))));
    }
    @PostMapping
    public ResponseEntity<ApiResponse<Book>> create(@RequestBody Book b) {
        if(b.getTitle()==null||b.getTitle().isBlank()) throw new AppException(400,"Title is required");
        if(b.getAuthor()==null||b.getAuthor().isBlank()) throw new AppException(400,"Author is required");
        if(b.getIsbn()==null||b.getIsbn().isBlank()) throw new AppException(400,"ISBN is required");
        if(b.getAvailable()==null) b.setAvailable(b.getQuantity()!=null?b.getQuantity():1);
        return ResponseEntity.status(201).body(ApiResponse.ok("Book added", repo.save(b)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Book>> update(@PathVariable Long id, @RequestBody Book b) {
        Book ex = repo.findById(id).orElseThrow(()->new AppException(404,"Book not found"));
        if(b.getTitle()!=null&&!b.getTitle().isBlank()) ex.setTitle(b.getTitle());
        if(b.getAuthor()!=null&&!b.getAuthor().isBlank()) ex.setAuthor(b.getAuthor());
        if(b.getIsbn()!=null&&!b.getIsbn().isBlank()) ex.setIsbn(b.getIsbn());
        if(b.getCategory()!=null) ex.setCategory(b.getCategory());
        if(b.getPublisher()!=null) ex.setPublisher(b.getPublisher());
        if(b.getQuantity()!=null) ex.setQuantity(b.getQuantity());
        if(b.getAvailable()!=null) ex.setAvailable(b.getAvailable());
        if(b.getStatus()!=null) ex.setStatus(b.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Book updated", repo.save(ex)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        repo.findById(id).orElseThrow(()->new AppException(404,"Book not found"));
        repo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Book deleted", null));
    }
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String,Long>>> stats() {
        return ResponseEntity.ok(ApiResponse.ok("OK", Map.of(
            "total", repo.count(),
            "available", repo.findByStatusContainingIgnoreCase("AVAILABLE").stream().count(),
            "unavailable", repo.findByStatusContainingIgnoreCase("UNAVAILABLE").stream().count()
        )));
    }
}
