package com.mentixora.backend.controller;

import com.mentixora.backend.config.JwtUtil;
import com.mentixora.backend.dto.CommentDto;
import com.mentixora.backend.entity.Comment;
import com.mentixora.backend.entity.Post;
import com.mentixora.backend.entity.User;
import com.mentixora.backend.repository.CommentRepository;
import com.mentixora.backend.repository.PostRepository;
import com.mentixora.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    // GET all comments for a post - /api/comments/post/{postId}
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPost(
            @PathVariable Long postId) {
        return ResponseEntity.ok(
                commentRepository.findByPostIdOrderByCreatedAtDesc(postId)
        );
    }

    // POST add comment - /api/comments
    @PostMapping
    public ResponseEntity<?> addComment(
            @RequestBody CommentDto dto,
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

        // Create comment
        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setAuthor(user);
        comment.setPost(post);

        // Add karma for commenting
        user.setKarma(user.getKarma() + 2);
        user.setCredixScore(user.getCredixScore() + 2);
        userRepository.save(user);

        Comment saved = commentRepository.save(comment);
        return ResponseEntity.ok(saved);
    }

    // DELETE comment - /api/comments/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        Comment comment = commentRepository.findById(id).orElse(null);
        if (comment == null) {
            return ResponseEntity.badRequest().body("Comment not found");
        }

        if (!comment.getAuthor().getEmail().equals(email)) {
            return ResponseEntity.badRequest().body("Not authorized");
        }

        commentRepository.delete(comment);
        return ResponseEntity.ok("Comment deleted");
    }
}