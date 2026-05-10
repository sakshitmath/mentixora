package com.mentixora.backend.repository;

import com.mentixora.backend.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {

    // Check if user already voted on this post
    Optional<Vote> findByUserIdAndPostId(Long userId, Long postId);
}