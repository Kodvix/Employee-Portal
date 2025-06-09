package com.kodvix.ems.exception;
public class InvalidEventDataException extends RuntimeException {
    public InvalidEventDataException(String message) {
        super(message);
    }
}