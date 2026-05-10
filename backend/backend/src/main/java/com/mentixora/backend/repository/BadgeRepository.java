package com.mentixora.backend.repository;

import com.mentixora.backend.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {

    // Get all badges for a user
    List<Badge> findByUserId(Long userId);

    // Check if user already has a specific badge
    boolean existsByUserIdAndBadgeName(Long userId, String badgeName);
}