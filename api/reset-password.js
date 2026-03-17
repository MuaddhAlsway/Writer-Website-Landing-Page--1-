// In-memory storage for reset tokens
const resetTokens = new Map();
const adminAccounts = new Map();

// Initialize with a test admin account
adminAccounts.set('admin@example.com', {
  email: 'admin@example.com',
  password: 'admin123',
  id: 'admin-1',
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  // GET - Verify token
  if (req.method === 'GET') {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    const tokenData = resetTokens.get(token);

    if (!tokenData) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    if (tokenData.expiresAt < Date.now()) {
      resetTokens.delete(token);
      return res.status(400).json({ error: 'Token expired' });
    }

    if (tokenData.used) {
      return res.status(400).json({ error: 'Token already used' });
    }

    return res.status(200).json({
      success: true,
      email: tokenData.email,
      token: token,
    });
  }

  // POST - Reset password
  if (req.method === 'POST') {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const tokenData = resetTokens.get(token);

    if (!tokenData) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    if (tokenData.expiresAt < Date.now()) {
      resetTokens.delete(token);
      return res.status(400).json({ error: 'Token expired' });
    }

    if (tokenData.used) {
      return res.status(400).json({ error: 'Token already used' });
    }

    try {
      // Update password
      const admin = adminAccounts.get(tokenData.email);
      if (admin) {
        admin.password = newPassword;
      } else {
        // Create new admin account if doesn't exist
        adminAccounts.set(tokenData.email, {
          email: tokenData.email,
          password: newPassword,
          id: `admin-${Date.now()}`,
        });
      }

      // Mark token as used
      tokenData.used = true;

      return res.status(200).json({
        success: true,
        message: 'Password reset successfully',
        email: tokenData.email,
      });
    } catch (err) {
      console.error('Reset password error:', err);
      return res.status(500).json({
        error: 'Failed to reset password',
        details: err.message,
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
