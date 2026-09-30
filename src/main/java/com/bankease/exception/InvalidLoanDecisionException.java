package com.bankease.exception;

public class InvalidLoanDecisionException extends RuntimeException {
    public InvalidLoanDecisionException(String message) {
        super(message);
    }
}
