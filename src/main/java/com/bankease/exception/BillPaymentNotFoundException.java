package com.bankease.exception;

public class BillPaymentNotFoundException extends RuntimeException {
    public BillPaymentNotFoundException(String message) {
        super(message);
    }
}
