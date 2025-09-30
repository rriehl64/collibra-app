const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1';

export interface DocumentationSection {
  id: string;
  title: string;
  icon: string;
  content: string[];
  status: 'Complete' | 'In Progress' | 'Not Started';
  priority: 'High' | 'Medium' | 'Low';
  lastUpdated?: Date;
  updatedBy?: string;
}

export interface ProgramDocumentation {
  _id?: string;
  projectId: string;
  projectName: string;
  portfolioId: string;
  sections: DocumentationSection[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  version?: number;
}

class ProgramDocumentationService {
  private baseUrl = `${API_BASE_URL}/program-documentation`;

  // Get program documentation by project ID
  async getProgramDocumentation(projectId: string): Promise<ProgramDocumentation> {
    try {
      const response = await fetch(`${this.baseUrl}/${projectId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching program documentation:', error);
      throw error;
    }
  }

  // Get all program documentation for a portfolio
  async getPortfolioDocumentation(portfolioId: string): Promise<ProgramDocumentation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/portfolio/${portfolioId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching portfolio documentation:', error);
      throw error;
    }
  }

  // Create program documentation
  async createProgramDocumentation(documentation: Omit<ProgramDocumentation, '_id' | 'createdAt' | 'updatedAt'>): Promise<ProgramDocumentation> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentation),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating program documentation:', error);
      throw error;
    }
  }

  // Update program documentation
  async updateProgramDocumentation(projectId: string, documentation: Partial<ProgramDocumentation>): Promise<ProgramDocumentation> {
    try {
      const response = await fetch(`${this.baseUrl}/${projectId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentation),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating program documentation:', error);
      throw error;
    }
  }

  // Update specific documentation section
  async updateDocumentationSection(projectId: string, sectionId: string, sectionData: Partial<DocumentationSection>): Promise<ProgramDocumentation> {
    try {
      const response = await fetch(`${this.baseUrl}/${projectId}/section/${sectionId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating documentation section:', error);
      throw error;
    }
  }

  // Delete program documentation
  async deleteProgramDocumentation(projectId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting program documentation:', error);
      throw error;
    }
  }

  // Initialize default documentation for a project
  getDefaultDocumentation(projectId: string, projectName: string, portfolioId: string): ProgramDocumentation {
    return {
      projectId,
      projectName,
      portfolioId,
      sections: [
        {
          id: 'goals',
          title: 'Program Goals & Objectives',
          icon: 'GpsFixed',
          status: 'Not Started',
          priority: 'High',
          content: [
            'Define strategic program objectives aligned with USCIS mission',
            'Establish measurable outcomes and success criteria',
            'Ensure compliance with federal regulations and standards',
            'Create stakeholder engagement and communication plan',
            'Develop risk mitigation and contingency strategies'
          ]
        },
        {
          id: 'targets',
          title: 'Key Performance Targets',
          icon: 'Analytics',
          status: 'Not Started',
          priority: 'High',
          content: [
            'Define quantifiable performance metrics and KPIs',
            'Establish baseline measurements and target thresholds',
            'Create performance monitoring and reporting framework',
            'Set milestone deadlines and delivery schedules',
            'Implement quality assurance and validation processes'
          ]
        },
        {
          id: 'sops',
          title: 'Standard Operating Procedures',
          icon: 'Assignment',
          status: 'Not Started',
          priority: 'High',
          content: [
            'Document step-by-step operational procedures',
            'Define roles, responsibilities, and approval workflows',
            'Create process documentation and version control',
            'Establish change management and update procedures',
            'Implement compliance monitoring and audit trails'
          ]
        },
        {
          id: 'jobAids',
          title: 'Job Aids & Training Materials',
          icon: 'Help',
          status: 'Not Started',
          priority: 'Medium',
          content: [
            'Develop user guides and quick reference materials',
            'Create training curricula and certification programs',
            'Design interactive learning modules and assessments',
            'Establish knowledge management and documentation systems',
            'Implement continuous learning and skill development programs'
          ]
        },
        {
          id: 'deliverables',
          title: 'Program Deliverables',
          icon: 'LocalShipping',
          status: 'Not Started',
          priority: 'High',
          content: [
            'Define project scope and deliverable specifications',
            'Create work breakdown structure and task dependencies',
            'Establish quality standards and acceptance criteria',
            'Implement delivery tracking and milestone management',
            'Develop stakeholder communication and reporting protocols'
          ]
        },
        {
          id: 'analytics',
          title: 'Advanced Data Analytics',
          icon: 'Analytics',
          status: 'Not Started',
          priority: 'Medium',
          content: [
            'Implement predictive modeling and forecasting capabilities',
            'Develop automated reporting and dashboard solutions',
            'Create data visualization and business intelligence tools',
            'Establish performance analytics and trend analysis',
            'Design machine learning and AI-enhanced features'
          ]
        },
        {
          id: 'quality',
          title: 'Quality Assurance Framework',
          icon: 'HighQuality',
          status: 'Not Started',
          priority: 'High',
          content: [
            'Define quality standards and measurement criteria',
            'Implement testing protocols and validation procedures',
            'Create defect tracking and resolution processes',
            'Establish continuous improvement and feedback loops',
            'Develop quality metrics and performance indicators'
          ]
        },
        {
          id: 'dataManagement',
          title: 'Data Management Processes',
          icon: 'Storage',
          status: 'Not Started',
          priority: 'High',
          content: [
            'Implement data governance and stewardship programs',
            'Create data lifecycle management and retention policies',
            'Establish data quality monitoring and remediation processes',
            'Design data integration and interoperability frameworks',
            'Develop data security and privacy protection measures'
          ]
        },
        {
          id: 'governance',
          title: 'Data Governance Structure',
          icon: 'Security',
          status: 'Not Started',
          priority: 'High',
          content: [
            'Establish governance council and decision-making authority',
            'Define data stewardship roles and accountability matrix',
            'Create policy development and approval workflows',
            'Implement compliance monitoring and audit procedures',
            'Develop governance maturity assessment framework'
          ]
        },
        {
          id: 'reports',
          title: 'Reporting & Dashboards',
          icon: 'Assessment',
          status: 'Not Started',
          priority: 'Medium',
          content: [
            'Design executive dashboards and performance scorecards',
            'Create operational reporting and monitoring systems',
            'Implement real-time analytics and alerting capabilities',
            'Develop customizable reporting and data export features',
            'Establish report distribution and access control protocols'
          ]
        }
      ]
    };
  }
}

export default new ProgramDocumentationService();
