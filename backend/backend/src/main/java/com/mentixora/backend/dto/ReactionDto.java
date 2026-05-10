package com.mentixora.backend.dto;

import lombok.Data;

@Data
public class ReactionDto {
    // HELPFUL, RELATABLE, INTERESTING, INSPIRATIONAL, FUNNY, APPRECIATED
    private String reactionType;
    private Long postId;
}