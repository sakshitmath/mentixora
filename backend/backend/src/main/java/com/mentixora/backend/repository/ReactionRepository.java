package com.mentixora.backend.repository;

import com.mentixora.backend.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {

    // Check if user already reacted to this post
    Optional<Reaction> findByUserIdAndPostId(Long userId, Long postId);

    // Get all reactions for a post
    List<Reaction> findByPostId(Long postId);

    // Count reactions by type for a post
    @Query("SELECT r.reactionType, COUNT(r) FROM Reaction r WHERE r.post.id = :postId GROUP BY r.reactionType")
    List<Object[]> countReactionsByPost(Long postId);
}