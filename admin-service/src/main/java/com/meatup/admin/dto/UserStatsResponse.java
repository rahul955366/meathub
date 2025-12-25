package com.meatup.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private long totalConsumers;
    private long newUsersToday;

    // Placeholder for when User Service provides more detail
    private long activeUsers;
}
