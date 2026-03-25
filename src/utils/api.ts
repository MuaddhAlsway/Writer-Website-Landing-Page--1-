// Detect environment and set API base URL
const getApiBase = () => {
  // Always use relative paths - Cloudflare Pages functions handle routing
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

        const url = this.apiBase ? `${this.apiBase}/api/admin-refresh` : '/api/admin-refresh';
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
      if (response.status === 401 && this.refreshToken && endpoint !== '/api/admin-login') {
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
    try {
      const response = await fetch(`/api/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add subscriber');
      return data;
    } catch (err) {
      console.error('Add subscriber error:', err);
      throw err;
    }
  }

  async getSubscribers() {
    try {
      const response = await fetch(`/api/subscribers`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` },
      });
      if (!response.ok) throw new Error('Failed to get subscribers');
      return await response.json();
    } catch (err) {
      console.error('Get subscribers error:', err);
      throw err;
    }
  }

  async deleteSubscriber(email: string) {
    try {
      const response = await fetch(`/api/subscribers/${email}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${this.accessToken}` },
      });
      if (!response.ok) throw new Error('Failed to delete subscriber');
      return await response.json();
    } catch (err) {
      console.error('Delete subscriber error:', err);
      throw err;
    }
  }

  // Newsletters
  async createNewsletter(title: string, content: string, language: string = 'en') {
    try {
      const response = await fetch(`/api/newsletters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.accessToken}` },
        body: JSON.stringify({ subject: title, content, language }),
      });
      if (!response.ok) throw new Error('Failed to create newsletter');
      return await response.json();
    } catch (err) {
      console.error('Create newsletter error:', err);
      throw err;
    }
  }

  async getNewsletters() {
    try {
      const response = await fetch(`/api/newsletters`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` },
      });
      if (!response.ok) throw new Error('Failed to get newsletters');
      return await response.json();
    } catch (err) {
      console.error('Get newsletters error:', err);
      throw err;
    }
  }

  async sendNewsletter(id: string, recipients?: string[]) {
    try {
      // Get the newsletter first to get its content
      const newslettersResponse = await fetch(`/api/newsletters`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` },
      });
      
      if (!newslettersResponse.ok) {
        throw new Error('Failed to get newsletters');
      }

      const { newsletters } = await newslettersResponse.json();
      const newsletter = newsletters.find((n: any) => n.id === id);

      if (!newsletter) {
        throw new Error('Newsletter not found');
      }

      // Get subscribers to send to
      const subscribersResponse = await fetch(`/api/subscribers`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` },
      });

      if (!subscribersResponse.ok) {
        throw new Error('Failed to get subscribers');
      }

      const { subscribers } = await subscribersResponse.json();
      const recipientEmails = subscribers.map((s: any) => s.email);

      if (recipientEmails.length === 0) {
        throw new Error('No subscribers to send to');
      }

      // Send the newsletter
      const response = await fetch(`/api/send-newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.accessToken}` },
        body: JSON.stringify({ 
          recipients: recipientEmails,
          subject: newsletter.subject || newsletter.title,
          content: newsletter.content,
          language: newsletter.language,
          id: id
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to send newsletter');
      }

      return await response.json();
    } catch (err) {
      console.error('Send newsletter error:', err);
      throw err;
    }
  }

  async sendNewsletterViaFormspree(subscribers: string[], subject: string, htmlContent: string) {
    // This method is deprecated - use the backend API instead
    // The backend handles email sending via Unosend
    return { success: true, message: 'Use backend API for sending' };
  }

  async deleteNewsletter(id: string) {
    try {
      const response = await fetch(`/api/newsletters`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.accessToken}` },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to delete newsletter');
      return await response.json();
    } catch (err) {
      console.error('Delete newsletter error:', err);
      throw err;
    }
  }

  // Email - Send via backend API (with email template and icon)
  async sendEmail(recipients: string[], subject: string, content: string, image?: string, language: string = 'en') {
    try {
      const response = await fetch(`/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          recipients, 
          subject, 
          content,
          language 
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `Backend error: ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      console.error('Email send error:', err);
      throw err;
    }
  }

  // Admin Authentication
  async adminLogin(email: string, password: string) {
    const response = await this.request('/api/admin-login', {
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
      await this.request('/api/admin-logout', {
        method: 'POST',
        body: JSON.stringify({}),
      });
    } finally {
      this.clearTokens();
    }
  }

  async requestPasswordReset(email: string) {
    try {
      const response = await fetch(`/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language: 'en' }),
      });
      if (!response.ok) throw new Error('Failed to send reset email');
      return await response.json();
    } catch (err) {
      console.error('Request password reset error:', err);
      throw err;
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const response = await fetch(`/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to reset password');
      return data;
    } catch (err) {
      console.error('Reset password error:', err);
      throw err;
    }
  }

  async verifyResetToken(token: string) {
    try {
      const response = await fetch(`/api/reset-password?token=${token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Invalid or expired token');
      return await response.json();
    } catch (err) {
      console.error('Verify reset token error:', err);
      throw err;
    }
  }

  async updateAdminProfile(updates: { email?: string; username?: string; name?: string }) {
    return this.request('/api/admin-profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/api/admin-change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async getAdminProfile() {
    return this.request('/api/admin-profile', {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient();


