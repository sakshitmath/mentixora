package com.mentixora.backend.controller;

import com.mentixora.backend.config.JwtUtil;
import com.mentixora.backend.dto.VoteDto;
import com.mentixora.backend.entity.Post;
import com.mentixora.backend.entity.User;
import com.mentixora.backend.entity.Vote;
import com.mentixora.backend.repository.PostRepository;
import com.mentixora.backend.repository.UserRepository;
import com.mentixora.backend.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VoteController {

    private final VoteRepository voteRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    // POST vote on a post - /api/votes
    @PostMapping
    public ResponseEntity<?> vote(
            @RequestBody VoteDto dto,
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

        // Check if user already voted
        Vote existingVote = voteRepository
                .findByUserIdAndPostId(user.getId(), post.getId())
                .orElse(null);

        if (existingVote != null) {
            // If same vote type - remove vote (toggle off)
            if (existingVote.getVoteType().equals(dto.getVoteType())) {
                // Undo the vote count
                if (dto.getVoteType().equals("UPVOTE")) {
                    post.setUpvotes(post.getUpvotes() - 1);
                } else {
                    post.setDownvotes(post.getDownvotes() - 1);
                }
                voteRepository.delete(existingVote);
                postRepository.save(post);
                return ResponseEntity.ok("Vote removed");
            }

            // If different vote type - change vote
            if (dto.getVoteType().equals("UPVOTE")) {
                post.setUpvotes(post.getUpvotes() + 1);
                post.setDownvotes(post.getDownvotes() - 1);
            } else {
                post.setDownvotes(post.getDownvotes() + 1);
                post.setUpvotes(post.getUpvotes() - 1);
            }
            existingVote.setVoteType(dto.getVoteType());
            voteRepository.save(existingVote);
            postRepository.save(post);
            return ResponseEntity.ok("Vote changed");
        }

        // New vote
        Vote vote = new Vote();
        vote.setVoteType(dto.getVoteType());
        vote.setUser(user);
        vote.setPost(post);

        // Update post vote count
        if (dto.getVoteType().equals("UPVOTE")) {
            post.setUpvotes(post.getUpvotes() + 1);
            // Add karma to post author
            Post finalPost = post;
            userRepository.findById(post.getAuthor().getId())
                    .ifPresent(author -> {
                        author.setKarma(author.getKarma() + 10);
                        author.setCredixScore(author.getCredixScore() + 10);
                        userRepository.save(author);
                    });
        } else {
            post.setDownvotes(post.getDownvotes() + 1);
        }

        voteRepository.save(vote);
        postRepository.save(post);
        return ResponseEntity.ok("Vote recorded");
    }
}