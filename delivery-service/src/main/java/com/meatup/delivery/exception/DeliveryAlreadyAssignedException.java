package com.meatup.delivery.exception;

public class DeliveryAlreadyAssignedException extends RuntimeException {
    public DeliveryAlreadyAssignedException(String message) {
        super(message);
    }
}
