package com.library.dto;
import java.time.LocalDateTime;

public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ApiResponse() {}
    public ApiResponse(boolean success, String message, T data) {
        this.success = success; this.message = message; this.data = data;
    }
    public static <T> ApiResponse<T> ok(String msg, T data) { return new ApiResponse<>(true, msg, data); }
    public static <T> ApiResponse<T> error(String msg) { return new ApiResponse<>(false, msg, null); }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public T getData() { return data; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
