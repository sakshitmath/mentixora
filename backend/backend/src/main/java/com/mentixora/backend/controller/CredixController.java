package com.mentixora.backend.controller;

import com.mentixora.backend.entity.Badge;
import com.mentixora.backend.entity.User;
import com.mentixora.backend.repository.BadgeRepository;
import com.mentixora.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credix")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CredixController {

    private final UserRepository userRepository;
    private final BadgeRepository badgeRepository;

    // GET user reputation + badges - /api/credix/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserCredix(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        List<Badge> badges = badgeRepository.findByUserId(userId);

        // Update contributor level based on credix score
        updateContributorLevel(user);

        return ResponseEntity.ok(new java.util.HashMap<>() {{
            put("userId", user.getId());
            put("username", user.getUsername());
            put("email", user.getEmail());
            put("bio", user.getBio());
            put("karma", user.getKarma());
            put("credixScore", user.getCredixScore());
            put("contributorLevel", user.getContributorLevel());
            put("createdAt", user.getCreatedAt());
            put("badges", badges);
        }});
    }

    // GET top contributors leaderboard - /api/credix/leaderboard
    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        List<User> users = userRepository.findAll();
        // Sort by credix score
        users.sort((a, b) -> b.getCredixScore() - a.getCredixScore());
        // Return top 10
        List<User> top10 = users.stream().limit(10).toList();
        return ResponseEntity.ok(top10);
    }

    // POST award badge manually - /api/credix/badge
    @PostMapping("/badge")
    public ResponseEntity<?> awardBadge(
            @RequestParam Long userId,
            @RequestParam String badgeName,
            @RequestParam String badgeIcon) {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Check if badge already exists
        if (badgeRepository.existsByUserIdAndBadgeName(userId, badgeName)) {
            return ResponseEntity.badRequest().body("Badge already awarded");
        }

        Badge badge = new Badge();
        badge.setBadgeName(badgeName);
        badge.setBadgeIcon(badgeIcon);
        badge.setUser(user);

        badgeRepository.save(badge);
        return ResponseEntity.ok("Badge awarded successfully");
    }

    // Auto update contributor level based on score
    private void updateContributorLevel(User user) {
        int score = user.getCredixScore();
        String level;

        if (score >= 500) {
            level = "MENTOR";
        } else if (score >= 200) {
            level = "CONTRIBUTOR";
        } else if (score >= 50) {
            level = "ACTIVE";
        } else {
            level = "NEWCOMER";
        }

        if (!level.equals(user.getContributorLevel())) {
            user.setContributorLevel(level);
            userRepository.save(user);
        }
    }
}