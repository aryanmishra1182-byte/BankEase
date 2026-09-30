package com.bankease.exception;

public class BillerNotFoundException extends RuntimeException {
    public BillerNotFoundException(String message) {
        super(message);
    }
}
