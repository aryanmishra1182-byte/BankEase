package com.bankease.exception;

public class ApplicationNotApprovedException extends RuntimeException {
    public ApplicationNotApprovedException(String message) {
        super(message);
    }
}
