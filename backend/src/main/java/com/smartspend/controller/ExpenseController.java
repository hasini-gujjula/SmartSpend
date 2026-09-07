package com.smartspend.controller;

import com.smartspend.dto.ExpenseRequest;
import com.smartspend.dto.ExpenseResponse;
import com.smartspend.entity.Expense;
import com.smartspend.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.smartspend.dto.ExpenseStatsResponse;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ExpenseStatsResponse> getMyStats(
            Authentication authentication) {

        return ResponseEntity.ok(
                expenseService.getMyStats(authentication.getName())
        );
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication) {

        Expense expense = expenseService.addExpense(
                authentication.getName(),
                request.getTitle(),
                request.getAmount(),
                request.getCategory(),
                request.getDescription(),
                request.getExpenseDate()
        );

        return ResponseEntity.ok(toResponse(expense));
    }

    @GetMapping
    public ResponseEntity<Page<ExpenseResponse>> getMyExpenses(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "") String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            Authentication authentication) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Expense> expenses = expenseService.getMyExpenses(
                authentication.getName(),
                search,
                category,
                pageable
        );

        Page<ExpenseResponse> response = expenses.map(this::toResponse);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication) {

        Expense expense = expenseService.updateExpense(
                id,
                authentication.getName(),
                request.getTitle(),
                request.getAmount(),
                request.getCategory(),
                request.getDescription(),
                request.getExpenseDate()
        );

        return ResponseEntity.ok(toResponse(expense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(
            @PathVariable Long id,
            Authentication authentication) {

        expenseService.deleteExpense(
                id,
                authentication.getName()
        );

        return ResponseEntity.ok("Expense deleted successfully");
    }

    private ExpenseResponse toResponse(Expense expense) {

        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDescription(),
                expense.getExpenseDate()
        );
    }
}