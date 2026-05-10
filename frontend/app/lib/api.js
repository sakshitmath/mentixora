import axios from 'axios';

// This connects our frontend to our Spring Boot backend
const API = axios.create({
    baseURL: 'http://localhost:8081',
});

// Automatically adds JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('mentixora_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ===== AUTH =====
export const signup = (data) => API.post('/api/auth/signup', data);
export const login = (data) => API.post('/api/auth/login', data);

// ===== COMMUNITIES =====
export const getCommunities = () => API.get('/api/communities');
export const getCommunity = (slug) => API.get(`/api/communities/${slug}`);
export const createCommunity = (data) => API.post('/api/communities', data);

// ===== POSTS =====
export const getPosts = () => API.get('/api/posts');
export const getTrendingPosts = () => API.get('/api/posts/trending');
export const getPostsByCommunity = (id) => API.get(`/api/posts/community/${id}`);
export const getPostsByMood = (mood) => API.get(`/api/posts/mood/${mood}`);
export const getPost = (id) => API.get(`/api/posts/${id}`);
export const createPost = (data) => API.post('/api/posts', data);

// ===== COMMENTS =====
export const getComments = (postId) => API.get(`/api/comments/post/${postId}`);
export const addComment = (data) => API.post('/api/comments', data);

// ===== VOTES =====
export const vote = (data) => API.post('/api/votes', data);

// ===== REACTIONS =====
export const react = (data) => API.post('/api/reactions', data);
export const getReactions = (postId) => API.get(`/api/reactions/post/${postId}`);

// ===== CREDIX =====
export const getUserCredix = (userId) => API.get(`/api/credix/user/${userId}`);
export const getLeaderboard = () => API.get('/api/credix/leaderboard');