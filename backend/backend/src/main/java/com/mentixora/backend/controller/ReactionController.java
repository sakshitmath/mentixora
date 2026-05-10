package com.mentixora.backend.controller;

import com.mentixora.backend.config.JwtUtil;
import com.mentixora.backend.dto.ReactionDto;
import com.mentixora.backend.entity.Post;
import com.mentixora.backend.entity.Reaction;
import com.mentixora.backend.entity.User;
import com.mentixora.backend.repository.PostRepository;
import com.mentixora.backend.repository.ReactionRepository;
import com.mentixora.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReactionController {

    private final ReactionRepository reactionRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    // GET reaction counts for a post - /api/reactions/post/{postId}
    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getReactions(@PathVariable Long postId) {
        List<Object[]> counts = reactionRepository.countReactionsByPost(postId);
        Map<String, Long> result = new HashMap<>();
        for (Object[] row : counts) {
            result.put((String) row[0], (Long) row[1]);
        }
        return ResponseEntity.ok(result);
    }

    // POST add or update reaction - /api/reactions
    @PostMapping
    public ResponseEntity<?> react(
            @RequestBody ReactionDto dto,
            @RequestHeader("Authorization") String authHeader) {

        // Get user from token
        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Get post
        Post post = postRepository.findById(dto.getPostId()).orElse(null);
        if (post == null) {
            return ResponseEntity.badRequest().body("Post not found");
        }

        // Check if user already reacted
        Reaction existing = reactionRepository
                .findByUserIdAndPostId(user.getId(), post.getId())
                .orElse(null);

        if (existing != null) {
            // If same reaction — remove it (toggle off)
            if (existing.getReactionType().equals(dto.getReactionType())) {
                reactionRepository.delete(existing);
                return ResponseEntity.ok("Reaction removed");
            }
            // If different reaction — update it
            existing.setReactionType(dto.getReactionType());
            reactionRepository.save(existing);
            return ResponseEntity.ok("Reaction updated");
        }

        // New reaction
        Reaction reaction = new Reaction();
        reaction.setReactionType(dto.getReactionType());
        reaction.setUser(user);
        reaction.setPost(post);

        // Add karma to post author for getting reaction
        userRepository.findById(post.getAuthor().getId())
                .ifPresent(author -> {
                    author.setKarma(author.getKarma() + 3);
                    author.setCredixScore(author.getCredixScore() + 3);
                    userRepository.save(author);
                });

        reactionRepository.save(reaction);
        return ResponseEntity.ok("Reaction added");
    }
}