package com.meathub.butcher.exception;

public class MeatItemNotFoundException extends RuntimeException {
    public MeatItemNotFoundException(String message) {
        super(message);
    }
}
