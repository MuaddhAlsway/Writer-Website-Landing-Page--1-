// Simple API client for Cloudflare Pages endpoints

interface ApiResponse<T> {
  success?: boolean;
  error?: string;
  details?: string;
  data?: T;
}

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  sentAt: string;
  recipientCount: number;
}

interface EmailResult {
  success: boolean;
  sent: number;
  failed: number;
  total: number;
}

class ApiClient {
  private token: string = '';
  private baseUrl: string = '';

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || '/api';
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: string; status: number }> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const body = await response.json();

      if (!response.ok) {
        return {
          error: body.error || `HTTP ${response.status}`,
          status: response.status,
        };
      }

      return {
        data: body,
        status: response.status,
      };
    } catch (err: any) {
      return {
        error: err.message || 'Network error',
        status: 0,
      };
    }
  }

  // Get all newsletters
  async getNewsletters(): Promise<{ newsletters: Newsletter[]; error?: string }> {
    const result = await this.request<{ newsletters: Newsletter[] }>('/newsletters');
    
    if (result.error) {
      return { newsletters: [], error: result.error };
    }

    return {
      newsletters: result.data?.newsletters || [],
    };
  }

  // Send a newsletter
  async sendNewsletter(subject: string, content: string): Promise<{ success: boolean; error?: string; sent?: number; failed?: number }> {
    const result = await this.request<EmailResult>('/newsletters', {
      method: 'POST',
      body: JSON.stringify({ subject, content }),
    });

    if (result.error) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      sent: result.data?.sent,
      failed: result.data?.failed,
    };
  }

  // Send email to specific recipients
  async sendEmail(
    recipients: string[],
    subject: string,
    content: string,
    language: string = 'en'
  ): Promise<{ success: boolean; error?: string; sent?: number; failed?: number }> {
    const result = await this.request<EmailResult>('/send-email', {
      method: 'POST',
      body: JSON.stringify({ recipients, subject, content, language }),
    });

    if (result.error) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      sent: result.data?.sent,
      failed: result.data?.failed,
    };
  }

  // Get subscribers
  async getSubscribers(): Promise<{ subscribers: any[]; error?: string }> {
    const result = await this.request<{ subscribers: any[] }>('/subscribers');
    
    if (result.error) {
      return { subscribers: [], error: result.error };
    }

    return {
      subscribers: result.data?.subscribers || [],
    };
  }

  // Add subscriber
  async addSubscriber(email: string, language: string = 'en'): Promise<{ success: boolean; error?: string }> {
    const result = await this.request('/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email, language }),
    });

    if (result.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  }
}

export const apiClient = new ApiClient();
