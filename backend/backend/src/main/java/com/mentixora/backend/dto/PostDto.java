package com.mentixora.backend.dto;

import lombok.Data;

// This is what we receive when user creates a post
@Data
public class PostDto {

    private String title;
    private String content;
    private String imageUrl;
    private String flair;

    // Mood: HAPPY, RANT, QUESTION, INSPIRING, DEBATE
    private String mood;

    // Which community this post belongs to
    private Long communityId;
}