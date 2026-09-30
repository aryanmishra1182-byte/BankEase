package com.bankease.exception;

public class AmountMissingException extends RuntimeException {
    public AmountMissingException(String message) {
        super(message);
    }
}
