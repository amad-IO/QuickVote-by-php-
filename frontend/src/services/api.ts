
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 Unauthorized responses (expired/invalid token)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            console.warn('Authentication failed: Token expired or invalid');
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');

            // Redirect to login with expired flag
            window.location.href = '/login?expired=true';
        }
        return Promise.reject(error);
    }
);

// Login API
export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/login', { email, password });
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

// Register API
export const register = async (email: string, password: string) => {
    try {
        const response = await api.post('/register', { email, password });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

// Get Candidates API
export const getCandidates = async () => {
    try {
        const response = await api.get('/candidates');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

// Vote API
export const vote = async (candidateId: number) => {
    try {
        const response = await api.post('/vote', { candidateId });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

// Get Results API
export const getResults = async () => {
    try {
        const response = await api.get('/results');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

// ============================================
// IMAGE UPLOAD API
// ============================================

// Upload Candidate Photo (returns URL)
export const uploadCandidatePhoto = async (file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('photo', file);

        const response = await api.post('/upload/candidate-photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.url; // Return the public URL
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

// ============================================
// POLL API FUNCTIONS
// ============================================

// Create Poll
export const createPoll = async (title: string, candidates: any[]) => {
    try {
        // Sanitize candidates: remove frontend-only fields (id, etc.)
        const sanitizedCandidates = candidates.map(c => ({
            name: c.name,
            description: c.description,
            photo: c.photo || null  // Ensure null instead of undefined/empty string
        }));

        const response = await api.post('/polls', {
            title,
            candidates: sanitizedCandidates
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

// Get All Polls
export const getPolls = async () => {
    try {
        const response = await api.get('/polls');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

// Get Single Poll
export const getPoll = async (pollId: string) => {
    try {
        const response = await api.get(`/polls/${pollId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

// Start Poll
export const startPoll = async (pollId: string) => {
    try {
        const response = await api.put(`/polls/${pollId}/start`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

// Stop Poll
export const stopPoll = async (pollId: string) => {
    try {
        const response = await api.put(`/polls/${pollId}/stop`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

// Submit Vote to Poll
export const submitVote = async (pollId: string, email: string, candidateId: string) => {
    try {
        const response = await api.post(`/polls/${pollId}/vote`, {
            email,
            candidate_id: candidateId
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

// Get Poll Results
export const getPollResults = async (pollId: string) => {
    try {
        const response = await api.get(`/polls/${pollId}/results`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

// Delete Poll
export const deletePoll = async (pollId: string) => {
    try {
        const response = await api.delete(`/polls/${pollId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};