package com.library.repository;
import com.library.model.Return;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReturnRepository extends JpaRepository<Return, Long> {
    List<Return> findByStatusContainingIgnoreCase(String status);
}
