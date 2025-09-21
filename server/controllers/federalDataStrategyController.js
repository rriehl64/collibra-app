const FederalDataStrategy = require('../models/FederalDataStrategy');

// Get the active Federal Data Strategy content
const getFederalDataStrategy = async (req, res) => {
  try {
    let strategy = await FederalDataStrategy.findOne({ isActive: true }).sort({ createdAt: -1 });
    
    // If no strategy exists, create default one
    if (!strategy) {
      strategy = await createDefaultStrategy();
    }
    
    res.json(strategy);
  } catch (error) {
    console.error('Error fetching Federal Data Strategy:', error);
    res.status(500).json({ 
      message: 'Error fetching Federal Data Strategy content',
      error: error.message 
    });
  }
};

// Update a specific section of the Federal Data Strategy
const updateSection = async (req, res) => {
  try {
    const { sectionType, sectionId, data } = req.body;
    
    let strategy = await FederalDataStrategy.findOne({ isActive: true });
    if (!strategy) {
      strategy = await createDefaultStrategy();
    }
    
    // Update based on section type
    switch (sectionType) {
      case 'header':
        if (data.title !== undefined) strategy.title = data.title;
        if (data.subtitle !== undefined) strategy.subtitle = data.subtitle;
        if (data.tags !== undefined) strategy.tags = data.tags;
        break;
        
      case 'mission':
        if (data.title !== undefined) strategy.missionTitle = data.title;
        if (data.text !== undefined) strategy.missionText = data.text;
        break;
        
      case 'principles':
        if (data.title !== undefined) strategy.principlesTitle = data.title;
        if (data.description !== undefined) strategy.principlesDescription = data.description;
        break;
        
      case 'principle':
        if (sectionId !== undefined && strategy.principles[sectionId]) {
          Object.assign(strategy.principles[sectionId], data);
        }
        break;
        
      case 'practices':
        if (data.title !== undefined) strategy.practicesTitle = data.title;
        if (data.description !== undefined) strategy.practicesDescription = data.description;
        break;
        
      case 'corePractice':
        if (sectionId !== undefined && strategy.corePractices[sectionId]) {
          Object.assign(strategy.corePractices[sectionId], data);
        }
        break;
        
      case 'implementation':
        if (data.title !== undefined) strategy.implementationTitle = data.title;
        if (data.description !== undefined) strategy.implementationDescription = data.description;
        break;
        
      case 'resources':
        if (data.title !== undefined) strategy.resourcesTitle = data.title;
        if (data.description !== undefined) strategy.resourcesDescription = data.description;
        if (data.url !== undefined) strategy.resourcesUrl = data.url;
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid section type' });
    }
    
    strategy.lastUpdatedBy = req.user?.name || 'Anonymous';
    await strategy.save();
    
    res.json({ 
      message: 'Section updated successfully',
      strategy 
    });
  } catch (error) {
    console.error('Error updating Federal Data Strategy section:', error);
    res.status(500).json({ 
      message: 'Error updating section',
      error: error.message 
    });
  }
};

// Add new item to a list (principles, practices, actions)
const addItem = async (req, res) => {
  try {
    const { sectionType, parentId, item } = req.body;
    
    let strategy = await FederalDataStrategy.findOne({ isActive: true });
    if (!strategy) {
      strategy = await createDefaultStrategy();
    }
    
    switch (sectionType) {
      case 'principleItem':
        if (strategy.principles[parentId]) {
          strategy.principles[parentId].items.push(item);
        }
        break;
        
      case 'practiceItem':
        if (strategy.corePractices[parentId]) {
          strategy.corePractices[parentId].practices.push(item);
        }
        break;
        
      case 'implementationAction':
        strategy.implementationActions.push(item);
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid section type for adding item' });
    }
    
    strategy.lastUpdatedBy = req.user?.name || 'Anonymous';
    await strategy.save();
    
    res.json({ 
      message: 'Item added successfully',
      strategy 
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ 
      message: 'Error adding item',
      error: error.message 
    });
  }
};

// Delete item from a list
const deleteItem = async (req, res) => {
  try {
    const { sectionType, parentId, itemId } = req.body;
    
    let strategy = await FederalDataStrategy.findOne({ isActive: true });
    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }
    
    switch (sectionType) {
      case 'principleItem':
        if (strategy.principles[parentId]) {
          strategy.principles[parentId].items.splice(itemId, 1);
        }
        break;
        
      case 'practiceItem':
        if (strategy.corePractices[parentId]) {
          strategy.corePractices[parentId].practices.splice(itemId, 1);
        }
        break;
        
      case 'implementationAction':
        strategy.implementationActions.splice(itemId, 1);
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid section type for deleting item' });
    }
    
    strategy.lastUpdatedBy = req.user?.name || 'Anonymous';
    await strategy.save();
    
    res.json({ 
      message: 'Item deleted successfully',
      strategy 
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ 
      message: 'Error deleting item',
      error: error.message 
    });
  }
};

// Create default strategy content
const createDefaultStrategy = async () => {
  const defaultStrategy = new FederalDataStrategy({
    title: '2020 Federal Data Strategy Framework',
    subtitle: 'A comprehensive 10-year vision for how the U.S. Federal Government will leverage data to deliver on its mission, serve the public, and steward resources in a secure, ethical, and effective manner.',
    tags: ['10-Year Vision', 'Federal Government', 'Data Strategy'],
    
    principles: [
      {
        category: 'Ethical Governance',
        description: 'Uphold ethics, exercise responsibility, and promote transparency in all data practices.',
        color: '#1976d2',
        items: [
          { text: 'Exercise Responsibility', order: 1 },
          { text: 'Uphold Ethics', order: 2 },
          { text: 'Promote Transparency', order: 3 }
        ],
        order: 1
      },
      {
        category: 'Conscious Design',
        description: 'Ensure relevance, harness existing data, anticipate future uses, and demonstrate responsiveness to stakeholders.',
        color: '#388e3c',
        items: [
          { text: 'Ensure Relevance', order: 1 },
          { text: 'Harness Existing Data', order: 2 },
          { text: 'Anticipate Future Uses', order: 3 },
          { text: 'Demonstrate Responsiveness', order: 4 }
        ],
        order: 2
      },
      {
        category: 'Learning Culture',
        description: 'Invest in ongoing learning, develop data leaders, and practice accountability across federal workforces.',
        color: '#f57c00',
        items: [
          { text: 'Invest in Learning', order: 1 },
          { text: 'Develop Data Leaders', order: 2 },
          { text: 'Practice Accountability', order: 3 }
        ],
        order: 3
      }
    ],
    
    corePractices: [
      {
        title: 'Value and Promote Data Use',
        color: '#9c27b0',
        practices: [
          { text: 'Identify critical agency questions', order: 1 },
          { text: 'Balance stakeholder needs', order: 2 },
          { text: 'Use data in decision-making', order: 3 },
          { text: 'Champion data use', order: 4 }
        ],
        order: 1
      },
      {
        title: 'Govern and Protect Data',
        color: '#d32f2f',
        practices: [
          { text: 'Prioritize data governance', order: 1 },
          { text: 'Protect confidentiality', order: 2 },
          { text: 'Ensure data authenticity', order: 3 },
          { text: 'Maintain thorough documentation and inventories', order: 4 }
        ],
        order: 2
      },
      {
        title: 'Enable Efficient, Appropriate Use',
        color: '#1976d2',
        practices: [
          { text: 'Increase workforce capacity', order: 1 },
          { text: 'Design data for reuse', order: 2 },
          { text: 'Communicate planned data uses', order: 3 },
          { text: 'Diversify access methods for greater impact', order: 4 }
        ],
        order: 3
      }
    ],
    
    implementationActions: [
      { text: 'Launch Chief Data Officer Council', order: 1 },
      { text: 'Improve AI data resources', order: 2 },
      { text: 'Publish open data inventories', order: 3 },
      { text: 'Establish foundational practices', order: 4 },
      { text: 'Develop shared solutions', order: 5 },
      { text: 'Create annual government-wide action plans', order: 6 }
    ]
  });
  
  return await defaultStrategy.save();
};

module.exports = {
  getFederalDataStrategy,
  updateSection,
  addItem,
  deleteItem
};
