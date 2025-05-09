import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}

class ApiService {
  private static instance: ApiService;
  private token: string | null = null;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public setToken(token: string) {
    this.token = token;
  }

  public clearToken() {
    this.token = null;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  public async request<T>({ method, endpoint, params, data, headers = {} }: RequestConfig): Promise<T> {
    try {
      const config = {
        method,
        url: `${BASE_URL}${endpoint}`,
        params,
        data,
        headers: {
          ...this.getHeaders(),
          ...headers,
        },
      };

      const response = await axios(config);
      return response.data as T;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        throw new Error(axiosError.response?.data?.message || 'Error en la petición');
      }
      throw error;
    }
  }

  // Métodos helper para cada tipo de petición
  public async get<T>(endpoint: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'GET', endpoint, params, headers });
  }

  public async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'POST', endpoint, data, headers });
  }

  public async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'PUT', endpoint, data, headers });
  }

  public async patch<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'PATCH', endpoint, data, headers });
  }

  public async delete<T>(endpoint: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'DELETE', endpoint, params, headers });
  }
}

export const apiService = ApiService.getInstance(); 