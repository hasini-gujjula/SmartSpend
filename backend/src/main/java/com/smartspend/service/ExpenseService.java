package com.smartspend.service;

import com.smartspend.entity.Expense;
import com.smartspend.entity.User;
import com.smartspend.repository.ExpenseRepository;
import com.smartspend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.smartspend.dto.ExpenseStatsResponse;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            UserRepository userRepository) {

        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public Expense addExpense(
            String email,
            String title,
            Double amount,
            String category,
            String description,
            java.time.LocalDate expenseDate) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = new Expense();

        expense.setTitle(title);
        expense.setAmount(amount);
        expense.setCategory(category);
        expense.setDescription(description);
        expense.setExpenseDate(expenseDate);
        expense.setUser(user);

        return expenseRepository.save(expense);
    }

    public Page<Expense> getMyExpenses(
            String email,
            String search,
            String category,
            Pageable pageable) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasCategory = category != null && !category.trim().isEmpty();

        if (hasSearch && hasCategory) {
            return expenseRepository
                    .findByUserAndCategoryIgnoreCaseAndTitleContainingIgnoreCase(
                            user,
                            category,
                            search,
                            pageable
                    );
        }

        if (hasCategory) {
            return expenseRepository.findByUserAndCategoryIgnoreCase(
                    user,
                    category,
                    pageable
            );
        }

        if (hasSearch) {
            return expenseRepository
                    .findByUserAndTitleContainingIgnoreCase(
                            user,
                            search,
                            pageable
                    );
        }

        return expenseRepository.findByUser(user, pageable);
    }

    public Expense updateExpense(
            Long id,
            String email,
            String title,
            Double amount,
            String category,
            String description,
            java.time.LocalDate expenseDate) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot update this expense");
        }

        expense.setTitle(title);
        expense.setAmount(amount);
        expense.setCategory(category);
        expense.setDescription(description);
        expense.setExpenseDate(expenseDate);

        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot delete this expense");
        }

        expenseRepository.delete(expense);
    }

    public ExpenseStatsResponse getMyStats(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Double totalAmount =
                expenseRepository.getTotalAmount(user);

        Long totalTransactions =
                expenseRepository.getTotalTransactions(user);

        Double highestExpense =
                expenseRepository.getHighestExpense(user);

        java.util.List<String> categories =
                expenseRepository.getCategoriesByUsage(user);

        String mostUsedCategory =
                categories.isEmpty() ? "None" : categories.get(0);

        return new ExpenseStatsResponse(
                totalAmount,
                totalTransactions,
                highestExpense,
                mostUsedCategory
        );
    }
}