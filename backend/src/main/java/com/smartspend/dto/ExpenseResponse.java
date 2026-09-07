package com.smartspend.dto;

import java.time.LocalDate;

public class ExpenseResponse {

    private Long id;
    private String title;
    private Double amount;
    private String category;
    private String description;
    private LocalDate expenseDate;

    public ExpenseResponse(
            Long id,
            String title,
            Double amount,
            String category,
            String description,
            LocalDate expenseDate) {

        this.id = id;
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.expenseDate = expenseDate;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Double getAmount() {
        return amount;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getExpenseDate() {
        return expenseDate;
    }
}