package com.smartspend.dto;

public class ExpenseStatsResponse {

    private Double totalAmount;
    private Long totalTransactions;
    private Double highestExpense;
    private String mostUsedCategory;

    public ExpenseStatsResponse(
            Double totalAmount,
            Long totalTransactions,
            Double highestExpense,
            String mostUsedCategory) {

        this.totalAmount = totalAmount;
        this.totalTransactions = totalTransactions;
        this.highestExpense = highestExpense;
        this.mostUsedCategory = mostUsedCategory;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public Long getTotalTransactions() {
        return totalTransactions;
    }

    public Double getHighestExpense() {
        return highestExpense;
    }

    public String getMostUsedCategory() {
        return mostUsedCategory;
    }
}