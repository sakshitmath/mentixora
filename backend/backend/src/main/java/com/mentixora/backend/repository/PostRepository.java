package com.mentixora.backend.repository;

import com.mentixora.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Get all posts by community
    List<Post> findByCommunityIdOrderByCreatedAtDesc(Long communityId);

    // Get all posts sorted by newest first
    List<Post> findAllByOrderByCreatedAtDesc();

    // Get trending posts - most upvotes in last 24 hours
    @Query("SELECT p FROM Post p WHERE p.createdAt >= :since ORDER BY p.upvotes DESC")
    List<Post> findTrendingPosts(LocalDateTime since);

    // Get posts by mood
    List<Post> findByMoodOrderByCreatedAtDesc(String mood);
}