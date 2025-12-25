package com.meathub.butcher.exception;

public class ButcherAlreadyExistsException extends RuntimeException {
    public ButcherAlreadyExistsException(String message) {
        super(message);
    }
}
