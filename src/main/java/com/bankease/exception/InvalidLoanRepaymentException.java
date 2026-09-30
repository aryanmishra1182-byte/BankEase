package com.bankease.exception;

public class InvalidLoanRepaymentException extends RuntimeException {
    public InvalidLoanRepaymentException(String message) {
        super(message);
    }
}
