// Detect environment and set API base URL
const getApiBase = () => {
  // Always use relative paths for API calls
  // This works for both local dev and Cloudflare Pages
  return '';
};

const FORMSPREE_ID = 'xeeevlgk';

class ApiClient {
  private token: string | null = null;
  private apiBase: string;

  constructor() {
    this.apiBase = getApiBase();
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.apiBase}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

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
}

export const apiClient = new ApiClient();
