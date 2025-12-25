package com.meatup.delivery.exception;

public class AgentAlreadyExistsException extends RuntimeException {
    public AgentAlreadyExistsException(String message) {
        super(message);
    }
}
