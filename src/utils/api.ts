// Detect environment and set API base URL
const getApiBase = () => {
  // In development, use direct backend URL
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:3001';
  }
  // In production, use relative paths for Cloudflare Pages
  return '';
};

const FORMSPREE_ID = 'xeeevlgk';

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private apiBase: string;
  private tokenRefreshPromise: Promise<string> | null = null;

  constructor() {
    this.apiBase = getApiBase();
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('admin_access_token');
      this.refreshToken = localStorage.getItem('admin_refresh_token');
    }
  }

  private saveTokensToStorage() {
    if (typeof window !== 'undefined') {
      if (this.accessToken) {
        localStorage.setItem('admin_access_token', this.accessToken);
      }
      if (this.refreshToken) {
        localStorage.setItem('admin_refresh_token', this.refreshToken);
      }
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.saveTokensToStorage();
  }

  setToken(accessToken: string) {
    this.accessToken = accessToken;
    this.saveTokensToStorage();
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
    }
  }

  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = (async () => {
      try {
        if (!this.refreshToken) {
          throw new Error('No refresh token available');
        }

        const url = this.apiBase ? `${this.apiBase}/api/admin/refresh` : '/api/admin/refresh';
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });

        if (!response.ok) {
          this.clearTokens();
          throw new Error('Token refresh failed');
        }

        const data = await response.json();
        this.accessToken = data.accessToken;
        this.saveTokensToStorage();
        return data.accessToken;
      } finally {
        this.tokenRefreshPromise = null;
      }
    })();

    return this.tokenRefreshPromise;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    // Use absolute URL in development, relative in production
    const url = this.apiBase ? `${this.apiBase}${endpoint}` : endpoint;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      let response = await fetch(url, {
        ...options,
        headers,
      });

      // If 401, try to refresh token and retry
      if (response.status === 401 && this.refreshToken && endpoint !== '/api/admin/login') {
        try {
          const newAccessToken = await this.refreshAccessToken();
          headers['Authorization'] = `Bearer ${newAccessToken}`;
          response = await fetch(url, {
            ...options,
            headers,
          });
        } catch (err) {
          this.clearTokens();
          throw new Error('Session expired. Please login again.');
        }
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `API error: ${response.status}`);
      }

      return response.json();
    } catch (err: any) {
      console.error(`API request failed: ${url}`, err);
      throw err;
    }
  }

  // Send email via Formspree
  async sendViaFormspree(email: string, subject: string, message: string) {
    try {
      const response = await fetch(`https://formspree.io/f/xeeevlgk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _to: email,  // Send TO this email address
          subject: subject,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Formspree error: ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      console.error('Formspree send error:', err);
      throw err;
    }
  }

  // Subscribers
  async addSubscriber(email: string, language: string = 'en') {
    return this.request('/make-server-53bed28f/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email, language }),
    });
  }

  async getSubscribers() {
    return this.request('/make-server-53bed28f/subscribers');
  }

  async getSubscriberStats() {
    return this.request('/make-server-53bed28f/subscribers/stats');
  }

  async deleteSubscriber(email: string) {
    return this.request(`/make-server-53bed28f/subscribers/${email}`, {
      method: 'DELETE',
    });
  }

  // Newsletters
  async createNewsletter(title: string, content: string, language: string = 'en') {
    return this.request('/make-server-53bed28f/newsletters', {
      method: 'POST',
      body: JSON.stringify({ title, content, language }),
    });
  }

  async getNewsletters() {
    return this.request('/make-server-53bed28f/newsletters');
  }

  async sendNewsletter(id: string) {
    return this.request(`/make-server-53bed28f/newsletters/${id}/send`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  async sendNewsletterViaFormspree(subscribers: string[], subject: string, htmlContent: string) {
    // This method is deprecated - use the backend API instead
    // The backend handles email sending via Unosend
    return { success: true, message: 'Use backend API for sending' };
  }

  async deleteNewsletter(id: string) {
    return this.request(`/make-server-53bed28f/newsletters/${id}`, {
      method: 'DELETE',
    });
  }

  // Email
  async sendEmail(recipients: string[], subject: string, content: string) {
    return this.request('/make-server-53bed28f/send-email', {
      method: 'POST',
      body: JSON.stringify({ recipients, subject, content }),
    });
  }

  // Admin Authentication
  async adminLogin(email: string, password: string) {
    const response = await this.request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.accessToken && response.refreshToken) {
      this.setTokens(response.accessToken, response.refreshToken);
    }
    
    return response;
  }

  async adminLogout() {
    try {
      await this.request('/api/admin/logout', {
        method: 'POST',
        body: JSON.stringify({}),
      });
    } finally {
      this.clearTokens();
    }
  }

  async requestPasswordReset(email: string) {
    return this.request('/api/admin/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request('/api/admin/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async updateAdminProfile(updates: { email?: string; username?: string; name?: string }) {
    return this.request('/api/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/api/admin/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async getAdminProfile() {
    return this.request('/api/admin/profile', {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient();
