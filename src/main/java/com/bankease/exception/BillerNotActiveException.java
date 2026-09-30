package com.bankease.exception;

public class BillerNotActiveException extends RuntimeException {
    public BillerNotActiveException(String message) {
        super(message);
    }
}
