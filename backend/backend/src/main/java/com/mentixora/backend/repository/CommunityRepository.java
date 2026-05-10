package com.mentixora.backend.repository;

import com.mentixora.backend.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {

    // Find community by slug (url-friendly name)
    Optional<Community> findBySlug(String slug);

    // Check if community name already exists
    boolean existsByName(String name);

    // Check if slug already exists
    boolean existsBySlug(String slug);
}