package com.bankease.exception;

public class LoanNotActiveException extends RuntimeException {
    public LoanNotActiveException(String message) {
        super(message);
    }
}
