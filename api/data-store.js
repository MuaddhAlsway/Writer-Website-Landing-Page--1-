// Shared in-memory data store for all API endpoints
export const dataStore = {
  subscribers: new Map(),
  newsletters: new Map(),
  monthlyStats: new Map(),
  resetTokens: new Map(),
  adminAccounts: new Map([
    ['admin@example.com', { email: 'admin@example.com', password: 'admin123', id: 'admin-1' }],
  ]),

  addSubscriber(email, language = 'en', name = '') {
    if (this.subscribers.has(email)) {
      return null;
    }
    const subscriber = {
      email,
      language,
      subscribedAt: new Date().toISOString(),
      name,
    };
    this.subscribers.set(email, subscriber);
    
    // Update monthly stats
    const month = new Date().toISOString().slice(0, 7);
    this.monthlyStats.set(month, (this.monthlyStats.get(month) || 0) + 1);
    
    return subscriber;
  },

  getSubscribers() {
    return Array.from(this.subscribers.values());
  },

  deleteSubscriber(email) {
    return this.subscribers.delete(email);
  },

  getStats() {
    const total = this.subscribers.size;
    const active = total > 0 ? Math.ceil(total * 0.8) : 0;
    
    // Generate monthly data for the last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toISOString().slice(0, 7);
      const count = this.monthlyStats.get(month) || 0;
      monthlyData.push({ month, count });
    }

    return {
      totalSubscribers: total,
      activeSubscribers: active,
      monthlyStats: monthlyData,
      growthRate: total > 0 ? ((active / total) * 100).toFixed(1) : 0,
    };
  },
};
