package com.bankease.exception;

public class LoanAlreadyDisbursedException extends RuntimeException {
    public LoanAlreadyDisbursedException(String message) {
        super(message);
    }
}
