import api, { ApiResponse } from './api';

export interface Kpi {
  _id?: string;
  name: string;
  definition?: string;
  calculationMethod?: string;
  dataSources?: string[];
  frequency?: string;
  owner?: string;
  category?: string;
  tags?: string[];
  currentValue?: number;
  targetValue?: number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  relatedKPIs?: string[];
  target?: string;
  thresholds?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  pagination?: any;
}

export const kpiService = {
  async list(params?: Record<string, string | number | boolean>): Promise<Paginated<Kpi>> {
    const res = await api.get<ApiResponse<Kpi[]>>('/kpis', { params });
    return {
      items: res.data.data || [],
      total: (res as any).data.count ?? res.data.total ?? (res.data.data ? res.data.data.length : 0),
      pagination: res.data.pagination,
    };
  },

  async getCategories(): Promise<string[]> {
    const res = await api.get<ApiResponse<string[]>>('/kpis/categories');
    return res.data.data || [];
  },

  async get(id: string): Promise<Kpi> {
    const res = await api.get<ApiResponse<Kpi>>(`/kpis/${id}`);
    if (!res.data.data) throw new Error('KPI not found in response');
    return res.data.data;
    },

  async create(payload: Kpi): Promise<Kpi> {
    const res = await api.post<ApiResponse<Kpi>>('/kpis', payload);
    if (!res.data.data) throw new Error('Created KPI missing in response');
    return res.data.data;
  },

  async update(id: string, payload: Partial<Kpi>): Promise<Kpi> {
    const res = await api.put<ApiResponse<Kpi>>(`/kpis/${id}`, payload);
    if (!res.data.data) throw new Error('Updated KPI missing in response');
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/kpis/${id}`);
  },
};
