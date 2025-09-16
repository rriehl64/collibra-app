import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1';

export interface MenuSettings {
  _id: string;
  menuId: string;
  text: string;
  path: string;
  isEnabled: boolean;
  category: 'primary' | 'secondary' | 'administration';
  order: number;
  requiredRole: 'user' | 'data-steward' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface MenuSettingsResponse {
  success: boolean;
  count: number;
  data: MenuSettings[];
}

export interface SingleMenuResponse {
  success: boolean;
  data: MenuSettings;
}

class MenuSettingsService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  async getAllMenuSettings(): Promise<MenuSettings[]> {
    try {
      const response = await axios.get<MenuSettingsResponse>(
        `${API_URL}/menu-settings`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching menu settings:', error);
      throw error;
    }
  }

  async getEnabledMenuItems(): Promise<MenuSettings[]> {
    try {
      const response = await axios.get<MenuSettingsResponse>(
        `${API_URL}/menu-settings/enabled`,
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching enabled menu items:', error);
      console.error('API URL:', `${API_URL}/menu-settings/enabled`);
      console.error('Error details:', (error as any).response?.data || (error as any).message);
      throw error;
    }
  }

  async toggleMenuItem(id: string): Promise<MenuSettings> {
    try {
      const response = await axios.patch<SingleMenuResponse>(
        `${API_URL}/menu-settings/${id}/toggle`,
        {},
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error toggling menu item:', error);
      throw error;
    }
  }

  async updateMenuItem(id: string, updates: Partial<MenuSettings>): Promise<MenuSettings> {
    try {
      const response = await axios.put<SingleMenuResponse>(
        `${API_URL}/menu-settings/${id}`,
        updates,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  }

  async initializeMenuItems(): Promise<MenuSettings[]> {
    try {
      const response = await axios.post<MenuSettingsResponse>(
        `${API_URL}/menu-settings/initialize`,
        {},
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error initializing menu items:', error);
      throw error;
    }
  }

  async bulkToggleMenuItems(menuIds: string[], isEnabled: boolean): Promise<void> {
    try {
      await axios.patch(
        `${API_URL}/menu-settings/bulk-toggle`,
        { menuIds, isEnabled },
        this.getAuthHeaders()
      );
    } catch (error) {
      console.error('Error bulk toggling menu items:', error);
      throw error;
    }
  }
}

export default new MenuSettingsService();
