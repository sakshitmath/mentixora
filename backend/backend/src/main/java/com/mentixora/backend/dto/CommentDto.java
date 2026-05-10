package com.mentixora.backend.dto;

import lombok.Data;

@Data
public class CommentDto {
    private String content;
    private Long postId;
}