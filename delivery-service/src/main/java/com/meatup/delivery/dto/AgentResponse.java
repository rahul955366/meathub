package com.meatup.delivery.dto;

import com.meatup.delivery.entity.DeliveryAgent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgentResponse {
    private Long id;
    private String name;
    private String phone;
    private DeliveryAgent.VehicleType vehicleType;
    private Boolean active;
    private LocalDateTime createdAt;
}
