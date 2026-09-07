package com.smartspend.repository;

import com.smartspend.entity.Expense;
import com.smartspend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    Page<Expense> findByUser(
            User user,
            Pageable pageable
    );

    Page<Expense> findByUserAndTitleContainingIgnoreCase(
            User user,
            String title,
            Pageable pageable
    );

    Page<Expense> findByUserAndCategoryIgnoreCase(
            User user,
            String category,
            Pageable pageable
    );

    Page<Expense> findByUserAndCategoryIgnoreCaseAndTitleContainingIgnoreCase(
            User user,
            String category,
            String title,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user = :user")
    Double getTotalAmount(@Param("user") User user);

    @Query("SELECT COUNT(e) FROM Expense e WHERE e.user = :user")
    Long getTotalTransactions(@Param("user") User user);

    @Query("SELECT COALESCE(MAX(e.amount), 0) FROM Expense e WHERE e.user = :user")
    Double getHighestExpense(@Param("user") User user);

    @Query("""
        SELECT e.category
        FROM Expense e
        WHERE e.user = :user
        GROUP BY e.category
        ORDER BY COUNT(e.category) DESC
        """)
    java.util.List<String> getCategoriesByUsage(@Param("user") User user);
}