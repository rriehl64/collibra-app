import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1';

// Interfaces for Federal Data Strategy data
export interface PrincipleItem {
  text: string;
  order: number;
  _id?: string;
}

export interface Principle {
  category: string;
  description: string;
  color: string;
  items: PrincipleItem[];
  order: number;
  _id?: string;
}

export interface PracticeItem {
  text: string;
  order: number;
  _id?: string;
}

export interface CorePractice {
  title: string;
  color: string;
  practices: PracticeItem[];
  order: number;
  _id?: string;
}

export interface ImplementationAction {
  text: string;
  order: number;
  _id?: string;
}

export interface FederalDataStrategyData {
  _id?: string;
  title: string;
  subtitle: string;
  tags: string[];
  missionTitle: string;
  missionText: string;
  principlesTitle: string;
  principlesDescription: string;
  principles: Principle[];
  practicesTitle: string;
  practicesDescription: string;
  corePractices: CorePractice[];
  implementationTitle: string;
  implementationDescription: string;
  implementationActions: ImplementationAction[];
  resourcesTitle: string;
  resourcesDescription: string;
  resourcesUrl: string;
  isActive: boolean;
  version: string;
  lastUpdatedBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSectionData {
  sectionType: string;
  sectionId?: number;
  data: any;
}

export interface AddItemData {
  sectionType: string;
  parentId?: number;
  item: any;
}

export interface DeleteItemData {
  sectionType: string;
  parentId?: number;
  itemId: number;
}

class FederalDataStrategyService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/federal-data-strategy`;
  }

  // Get the current Federal Data Strategy content
  async getFederalDataStrategy(): Promise<FederalDataStrategyData> {
    try {
      const response = await axios.get(this.baseURL);
      return response.data;
    } catch (error) {
      console.error('Error fetching Federal Data Strategy:', error);
      throw error;
    }
  }

  // Update a specific section
  async updateSection(updateData: UpdateSectionData): Promise<FederalDataStrategyData> {
    try {
      const response = await axios.put(`${this.baseURL}/section`, updateData);
      return response.data.strategy;
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  }

  // Add a new item to a list
  async addItem(addData: AddItemData): Promise<FederalDataStrategyData> {
    try {
      const response = await axios.post(`${this.baseURL}/item`, addData);
      return response.data.strategy;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  }

  // Delete an item from a list
  async deleteItem(deleteData: DeleteItemData): Promise<FederalDataStrategyData> {
    try {
      const response = await axios.delete(`${this.baseURL}/item`, { data: deleteData });
      return response.data.strategy;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  // Helper methods for specific section updates
  async updateHeader(data: { title?: string; subtitle?: string; tags?: string[] }): Promise<FederalDataStrategyData> {
    return this.updateSection({
      sectionType: 'header',
      data
    });
  }

  async updateMission(data: { title?: string; text?: string }): Promise<FederalDataStrategyData> {
    return this.updateSection({
      sectionType: 'mission',
      data
    });
  }

  async updatePrinciplesSection(data: { title?: string; description?: string }): Promise<FederalDataStrategyData> {
    return this.updateSection({
      sectionType: 'principles',
      data
    });
  }

  async updatePrinciple(principleIndex: number, data: Partial<Principle>): Promise<FederalDataStrategyData> {
    return this.updateSection({
      sectionType: 'principle',
      sectionId: principleIndex,
      data
    });
  }

  async updatePracticesSection(data: { title?: string; description?: string }): Promise<FederalDataStrategyData> {
    return this.updateSection({
      sectionType: 'practices',
      data
    });
  }

  async updateCorePractice(practiceIndex: number, data: Partial<CorePractice>): Promise<FederalDataStrategyData> {
    return this.updateSection({
      sectionType: 'corePractice',
      sectionId: practiceIndex,
      data
    });
  }

  async updateImplementation(data: { title?: string; description?: string }): Promise<FederalDataStrategyData> {
    return this.updateSection({
      sectionType: 'implementation',
      data
    });
  }

  async updateResources(data: { title?: string; description?: string; url?: string }): Promise<FederalDataStrategyData> {
    return this.updateSection({
      sectionType: 'resources',
      data
    });
  }

  // Helper methods for adding items
  async addPrincipleItem(principleIndex: number, item: PrincipleItem): Promise<FederalDataStrategyData> {
    return this.addItem({
      sectionType: 'principleItem',
      parentId: principleIndex,
      item
    });
  }

  async addPracticeItem(practiceIndex: number, item: PracticeItem): Promise<FederalDataStrategyData> {
    return this.addItem({
      sectionType: 'practiceItem',
      parentId: practiceIndex,
      item
    });
  }

  async addImplementationAction(item: ImplementationAction): Promise<FederalDataStrategyData> {
    return this.addItem({
      sectionType: 'implementationAction',
      item
    });
  }

  // Helper methods for deleting items
  async deletePrincipleItem(principleIndex: number, itemIndex: number): Promise<FederalDataStrategyData> {
    return this.deleteItem({
      sectionType: 'principleItem',
      parentId: principleIndex,
      itemId: itemIndex
    });
  }

  async deletePracticeItem(practiceIndex: number, itemIndex: number): Promise<FederalDataStrategyData> {
    return this.deleteItem({
      sectionType: 'practiceItem',
      parentId: practiceIndex,
      itemId: itemIndex
    });
  }

  async deleteImplementationAction(itemIndex: number): Promise<FederalDataStrategyData> {
    return this.deleteItem({
      sectionType: 'implementationAction',
      itemId: itemIndex
    });
  }
}

const federalDataStrategyService = new FederalDataStrategyService();
export default federalDataStrategyService;
