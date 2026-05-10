package com.mentixora.backend.controller;

import com.mentixora.backend.config.JwtUtil;
import com.mentixora.backend.dto.PostDto;
import com.mentixora.backend.entity.Community;
import com.mentixora.backend.entity.Post;
import com.mentixora.backend.entity.User;
import com.mentixora.backend.repository.CommunityRepository;
import com.mentixora.backend.repository.PostRepository;
import com.mentixora.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PostController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final JwtUtil jwtUtil;

    // GET all posts - /api/posts
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postRepository.findAllByOrderByCreatedAtDesc());
    }

    // GET trending posts - /api/posts/trending
    @GetMapping("/trending")
    public ResponseEntity<List<Post>> getTrendingPosts() {
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        return ResponseEntity.ok(postRepository.findTrendingPosts(since));
    }

    // GET posts by community - /api/posts/community/{communityId}
    @GetMapping("/community/{communityId}")
    public ResponseEntity<List<Post>> getPostsByCommunity(
            @PathVariable Long communityId) {
        return ResponseEntity.ok(
                postRepository.findByCommunityIdOrderByCreatedAtDesc(communityId)
        );
    }

    // GET posts by mood - /api/posts/mood/{mood}
    @GetMapping("/mood/{mood}")
    public ResponseEntity<List<Post>> getPostsByMood(
            @PathVariable String mood) {
        return ResponseEntity.ok(
                postRepository.findByMoodOrderByCreatedAtDesc(mood)
        );
    }

    // GET single post - /api/posts/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        Post post = postRepository.findById(id).orElse(null);
        if (post == null) {
            return ResponseEntity.badRequest().body("Post not found");
        }
        return ResponseEntity.ok(post);
    }

    // POST create post - /api/posts
    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestBody PostDto dto,
            @RequestHeader("Authorization") String authHeader) {

        // Get user from token
        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Get community
        Community community = communityRepository
                .findById(dto.getCommunityId()).orElse(null);

        if (community == null) {
            return ResponseEntity.badRequest().body("Community not found");
        }

        // Create post
        Post post = new Post();
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setImageUrl(dto.getImageUrl());
        post.setFlair(dto.getFlair());
        post.setMood(dto.getMood());
        post.setAuthor(user);
        post.setCommunity(community);

        // Add karma to user for posting
        user.setKarma(user.getKarma() + 5);
        user.setCredixScore(user.getCredixScore() + 5);
        userRepository.save(user);

        Post saved = postRepository.save(post);
        return ResponseEntity.ok(saved);
    }

    // DELETE post - /api/posts/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email).orElse(null);

        Post post = postRepository.findById(id).orElse(null);
        if (post == null) {
            return ResponseEntity.badRequest().body("Post not found");
        }

        // Only author can delete their post
        if (!post.getAuthor().getEmail().equals(email)) {
            return ResponseEntity.badRequest().body("Not authorized");
        }

        postRepository.delete(post);
        return ResponseEntity.ok("Post deleted successfully");
    }
}