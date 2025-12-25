package com.meathub.butcher.exception;

public class ButcherNotFoundException extends RuntimeException {
    public ButcherNotFoundException(String message) {
        super(message);
    }
}
