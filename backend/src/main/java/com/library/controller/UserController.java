package com.library.controller;
import com.library.dto.ApiResponse;
import com.library.exception.AppException;
import com.library.model.User;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins="*")
public class UserController {
    @Autowired UserRepository repo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAll(@RequestParam(required=false) String status) {
        List<User> list = (status!=null&&!status.isBlank()) ? repo.findByStatusContainingIgnoreCase(status) : repo.findAll();
        return ResponseEntity.ok(ApiResponse.ok("OK", list));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("OK", repo.findById(id).orElseThrow(()->new AppException(404,"User not found"))));
    }
    @PostMapping
    public ResponseEntity<ApiResponse<User>> create(@RequestBody User u) {
        if(u.getName()==null||u.getName().isBlank()) throw new AppException(400,"Name is required");
        if(u.getEmail()==null||!u.getEmail().contains("@")) throw new AppException(400,"Valid email is required");
        if(u.getPhone()==null||u.getPhone().isBlank()) throw new AppException(400,"Phone is required");
        if(u.getRole()==null||u.getRole().isBlank()) throw new AppException(400,"Role is required");
        return ResponseEntity.status(201).body(ApiResponse.ok("User created", repo.save(u)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> update(@PathVariable Long id, @RequestBody User u) {
        User ex = repo.findById(id).orElseThrow(()->new AppException(404,"User not found"));
        if(u.getName()!=null&&!u.getName().isBlank()) ex.setName(u.getName());
        if(u.getEmail()!=null&&!u.getEmail().isBlank()) ex.setEmail(u.getEmail());
        if(u.getPhone()!=null&&!u.getPhone().isBlank()) ex.setPhone(u.getPhone());
        if(u.getRole()!=null&&!u.getRole().isBlank()) ex.setRole(u.getRole());
        if(u.getStatus()!=null&&!u.getStatus().isBlank()) ex.setStatus(u.getStatus());
        if(u.getAddress()!=null) ex.setAddress(u.getAddress());
        return ResponseEntity.ok(ApiResponse.ok("User updated", repo.save(ex)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        repo.findById(id).orElseThrow(()->new AppException(404,"User not found"));
        repo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted", null));
    }
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String,Long>>> stats() {
        return ResponseEntity.ok(ApiResponse.ok("OK", Map.of(
            "total", repo.count(),
            "active", repo.findByStatusContainingIgnoreCase("ACTIVE").stream().count(),
            "inactive", repo.findByStatusContainingIgnoreCase("INACTIVE").stream().count()
        )));
    }
}
