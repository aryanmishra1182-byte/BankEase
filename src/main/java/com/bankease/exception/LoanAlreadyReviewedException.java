package com.bankease.exception;

public class LoanAlreadyReviewedException extends RuntimeException {
    public LoanAlreadyReviewedException(String message) {
        super(message);
    }
}
