import api from './api';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string;
  assignee: {
    _id: string;
    name: string;
    email: string;
  };
  creator: {
    _id: string;
    name: string;
    email: string;
  };
  taskType: 'Data Quality' | 'Governance' | 'Compliance' | 'Review' | 'Documentation' | 'Other';
  relatedAssets?: string[];
  relatedDomains?: string[];
  completionNotes?: string;
  completedAt?: string;
  history?: Array<{
    timestamp: string;
    updatedBy: string;
    fieldUpdated: string;
    oldValue: string;
    newValue: string;
  }>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status?: 'Open' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string;
  assignee?: string;
  creator?: string;
  taskType?: 'Data Quality' | 'Governance' | 'Compliance' | 'Review' | 'Documentation' | 'Other';
  relatedAssets?: string[];
  relatedDomains?: string[];
  tags?: string[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  completionNotes?: string;
}

class TaskService {
  // Get all tasks
  async getTasks(params?: {
    status?: string;
    priority?: string;
    taskType?: string;
    assignee?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) {
    try {
      const response = await api.get('/tasks', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  // Get tasks assigned to current user
  async getMyTasks() {
    try {
      const response = await api.get('/tasks/my-tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching my tasks:', error);
      throw error;
    }
  }

  // Get single task
  async getTask(id: string) {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  // Create new task
  async createTask(taskData: CreateTaskData) {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // Update task
  async updateTask(id: string, taskData: UpdateTaskData) {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Update task status only
  async updateTaskStatus(id: string, status: string) {
    try {
      const response = await api.patch(`/tasks/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }

  // Delete task
  async deleteTask(id: string) {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // Convert database task to frontend format
  convertToFrontendFormat(task: Task): any {
    return {
      _id: task._id,
      title: task.title,
      type: task.taskType?.toLowerCase().replace(' ', '_') || 'other',
      priority: task.priority.toLowerCase(),
      status: this.convertStatus(task.status),
      description: task.description,
      requestedBy: task.creator?.email || 'system@example.com',
      assetName: typeof task.relatedAssets?.[0] === 'object' && (task.relatedAssets[0] as any).name 
        ? (task.relatedAssets[0] as any).name 
        : task.relatedAssets?.[0] || 'Unknown Asset',
      assetType: 'Database',
      dueDate: task.dueDate,
      assignedTo: task.assignee?.email || '',
      relatedAssets: task.relatedAssets || []
    };
  }

  // Convert frontend status to database status
  private convertStatus(status: string): 'Open' | 'In Progress' | 'Completed' {
    switch (status) {
      case 'Open':
        return 'Open';
      case 'In Progress':
        return 'In Progress';
      case 'Completed':
        return 'Completed';
      default:
        return 'Open';
    }
  }

  // Convert frontend status to database status (reverse)
  convertToDbStatus(status: 'pending' | 'in_progress' | 'completed'): 'Open' | 'In Progress' | 'Completed' {
    switch (status) {
      case 'pending':
        return 'Open';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Open';
    }
  }

  // Convert frontend priority to database priority
  convertToDbPriority(priority: 'high' | 'medium' | 'low'): 'High' | 'Medium' | 'Low' {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Medium';
    }
  }
}

export default new TaskService();
