import axios from "axios";
import type { Credentials } from '@/types/credentials';

export const API_URL = 'http://localhost:3000/api/';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting access token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Handle refresh tokens on 401 response
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh tokens
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        const refreshResponse = await axios.get(`${API_URL}auth/refresh`, {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        });

        // Update tokens in storage
        const { access_token, refresh_token: newRefreshToken } = refreshResponse.data;

        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.clear();

        // router.push({ pathname: '/login' });
        throw refreshError;
      }
    }

    return Promise.reject(error)
  }
);


export const login = async (data: Credentials) => {
  return await axiosInstance.post(`auth/local/signin`, data);
}

export const logout = async () => {
  try {
    return await axiosInstance.post("auth/logout");
  } catch (error) {
    console.log("Error: ", error)
  }
}

export const getCurrent = async () => {
  return await axiosInstance.get(`users/current-user`);
}
