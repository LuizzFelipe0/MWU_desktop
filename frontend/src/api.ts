import axios from 'axios';
import { currentUserSession } from './services/currentUserSession.ts';

export const mwu_api = axios.create({
  baseURL: import.meta.env.VITE_MWU_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

mwu_api.interceptors.request.use((config) => {
  const userId = currentUserSession.getUserId();

  if (userId) {
    config.headers.set('x-user-id', userId);
  }

  return config;
});
