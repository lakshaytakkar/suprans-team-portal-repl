// API Client for communicating with backend

const API_BASE = '/api';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: { name: string; email: string; password: string; role?: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // User endpoints
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, updates: any) {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Lead endpoints
  async getLeads() {
    return this.request('/leads');
  }

  async getLead(id: string) {
    return this.request(`/leads/${id}`);
  }

  async createLead(leadData: any) {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  async updateLead(id: string, updates: any) {
    return this.request(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteLead(id: string) {
    return this.request(`/leads/${id}`, {
      method: 'DELETE',
    });
  }

  async assignLead(leadId: string, userId: string | null) {
    return this.request(`/leads/${leadId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Activity endpoints
  async getActivities(leadId?: string) {
    const query = leadId ? `?leadId=${leadId}` : '';
    return this.request(`/activities${query}`);
  }

  async createActivity(activityData: any) {
    return this.request('/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  }

  async deleteActivity(id: string) {
    return this.request(`/activities/${id}`, {
      method: 'DELETE',
    });
  }

  // Task endpoints
  async getTasks() {
    return this.request('/tasks');
  }

  async getTask(id: string) {
    return this.request(`/tasks/${id}`);
  }

  async createTask(taskData: any) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: string, updates: any) {
    return this.request(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: string) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Service endpoints
  async getServices() {
    return this.request('/services');
  }

  async createService(serviceData: any) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(id: string, updates: any) {
    return this.request(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteService(id: string) {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Template endpoints
  async getTemplates(type?: string) {
    const query = type ? `?type=${type}` : '';
    return this.request(`/templates${query}`);
  }

  async createTemplate(templateData: any) {
    return this.request('/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  async updateTemplate(id: string, updates: any) {
    return this.request(`/templates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteTemplate(id: string) {
    return this.request(`/templates/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
