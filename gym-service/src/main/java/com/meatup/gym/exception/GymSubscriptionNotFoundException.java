package com.meatup.gym.exception;

public class GymSubscriptionNotFoundException extends RuntimeException {
    public GymSubscriptionNotFoundException(String message) {
        super(message);
    }
}
