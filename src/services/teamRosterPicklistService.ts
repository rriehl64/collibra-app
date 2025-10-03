import api from './api';

export interface PicklistValue {
  _id?: string;
  value: string;
  isActive: boolean;
  displayOrder: number;
}

export interface Picklist {
  _id: string;
  type: 'role' | 'branch' | 'positionTitle';
  values: PicklistValue[];
  lastModified: string;
  modifiedBy: string;
}

export interface PicklistsResponse {
  success: boolean;
  count: number;
  data: Picklist[];
}

export interface PicklistResponse {
  success: boolean;
  data: Picklist;
}

const teamRosterPicklistService = {
  // Get all picklists
  getAll: async (): Promise<Picklist[]> => {
    const response = await api.get<PicklistsResponse>('/team-roster-picklists');
    return response.data.data;
  },

  // Get picklist by type
  getByType: async (type: string): Promise<Picklist> => {
    const response = await api.get<PicklistResponse>(`/team-roster-picklists/${type}`);
    return response.data.data;
  },

  // Update picklist
  update: async (type: string, values: PicklistValue[], modifiedBy: string): Promise<Picklist> => {
    const response = await api.put<PicklistResponse>(`/team-roster-picklists/${type}`, {
      values,
      modifiedBy
    });
    return response.data.data;
  },

  // Add value to picklist
  addValue: async (type: string, value: string, displayOrder: number): Promise<Picklist> => {
    const response = await api.post<PicklistResponse>(`/team-roster-picklists/${type}/values`, {
      value,
      displayOrder
    });
    return response.data.data;
  },

  // Delete value from picklist
  deleteValue: async (type: string, valueId: string): Promise<Picklist> => {
    const response = await api.delete<PicklistResponse>(`/team-roster-picklists/${type}/values/${valueId}`);
    return response.data.data;
  },

  // Initialize default picklists
  initialize: async (): Promise<Picklist[]> => {
    const response = await api.post<PicklistsResponse>('/team-roster-picklists/initialize');
    return response.data.data;
  }
};

export default teamRosterPicklistService;
