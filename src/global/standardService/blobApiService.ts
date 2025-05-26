import axios from 'axios';
import envs from '../../config/env.config';

const BASE_URL = envs.apiBaseUrl;

export const blobApiService = axios.create({
  baseURL: BASE_URL,
});