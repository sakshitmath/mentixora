package com.mentixora.backend.controller;

import com.mentixora.backend.dto.CommunityDto;
import com.mentixora.backend.entity.Community;
import com.mentixora.backend.entity.User;
import com.mentixora.backend.repository.CommunityRepository;
import com.mentixora.backend.repository.UserRepository;
import com.mentixora.backend.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommunityController {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    // GET all communities - /api/communities
    @GetMapping
    public ResponseEntity<List<Community>> getAllCommunities() {
        List<Community> communities = communityRepository.findAll();
        return ResponseEntity.ok(communities);
    }

    // GET single community by slug - /api/communities/{slug}
    @GetMapping("/{slug}")
    public ResponseEntity<?> getCommunityBySlug(@PathVariable String slug) {
        Community community = communityRepository.findBySlug(slug)
                .orElse(null);

        if (community == null) {
            return ResponseEntity.badRequest().body("Community not found");
        }

        return ResponseEntity.ok(community);
    }

    // POST create community - /api/communities
    @PostMapping
    public ResponseEntity<?> createCommunity(
            @RequestBody CommunityDto dto,
            @RequestHeader("Authorization") String authHeader) {

        // Extract token and get username
        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        // Find the user
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Check if name or slug already exists
        if (communityRepository.existsByName(dto.getName())) {
            return ResponseEntity.badRequest().body("Community name already taken");
        }

        if (communityRepository.existsBySlug(dto.getSlug())) {
            return ResponseEntity.badRequest().body("Community slug already taken");
        }

        // Create and save community
        Community community = new Community();
        community.setName(dto.getName());
        community.setDescription(dto.getDescription());
        community.setSlug(dto.getSlug());
        community.setBannerUrl(dto.getBannerUrl());
        community.setCreatedBy(user);
        community.setMemberCount(1);

        Community saved = communityRepository.save(community);
        return ResponseEntity.ok(saved);
    }
}