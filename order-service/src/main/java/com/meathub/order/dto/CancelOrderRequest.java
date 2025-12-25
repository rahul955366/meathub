package com.meathub.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CancelOrderRequest {

    @NotBlank(message = "Cancellation reason is required")
    @Size(max = 255, message = "Reason must not exceed 255 characters")
    private String reason;
}
