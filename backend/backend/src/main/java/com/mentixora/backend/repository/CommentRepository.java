package com.mentixora.backend.repository;

import com.mentixora.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Get all comments for a post
    List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId);
}