package com.mentixora.backend.dto;

import lombok.Data;

// This is what we receive when user creates a community
@Data
public class CommunityDto {

    private String name;
    private String description;
    private String slug;
    private String bannerUrl;
}