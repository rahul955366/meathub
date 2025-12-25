// MEATHUB - User API Client

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

export const userApi = {
  async setPreferredButcher(butcherId: number): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/preferred-butcher/${butcherId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to set preferred butcher');
    }
  },

  async getPreferredButcher(): Promise<number | null> {
    const token = localStorage.getItem('token');
    if (!token) {
      return null; // Not authenticated, return null silently
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/preferred-butcher`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated, return null silently
          return null;
        }
        return null;
      }

      const butcherId = await response.json();
      return butcherId || null;
    } catch (error) {
      console.error('Failed to get preferred butcher:', error);
      return null;
    }
  },

  async removePreferredButcher(): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/preferred-butcher`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove preferred butcher');
    }
  },
};

