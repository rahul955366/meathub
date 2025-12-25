package com.meatup.ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(length = 1000)
    private String userMessage;

    @Column(length = 1000)
    private String aiResponse;

    @Column(length = 50)
    private String detectedIntent;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
