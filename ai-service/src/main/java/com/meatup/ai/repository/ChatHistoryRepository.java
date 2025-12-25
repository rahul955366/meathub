package com.meatup.ai.repository;

import com.meatup.ai.entity.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
}
