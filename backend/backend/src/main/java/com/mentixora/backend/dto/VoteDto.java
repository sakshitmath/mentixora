package com.mentixora.backend.dto;

import lombok.Data;

@Data
public class VoteDto {
    // UPVOTE or DOWNVOTE
    private String voteType;
    private Long postId;
}