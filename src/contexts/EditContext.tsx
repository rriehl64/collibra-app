import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context value types
interface EditContextType {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  currentEditingSection: string | null;
  setCurrentEditingSection: (section: string | null) => void;
  isUserAdmin: boolean;
}

// Create the context with default values
export const EditContext = createContext<EditContextType>({
  editMode: false,
  setEditMode: () => {},
  currentEditingSection: null,
  setCurrentEditingSection: () => {},
  isUserAdmin: false,
});

// Custom hook for using the edit context
export const useEdit = () => useContext(EditContext);

interface EditProviderProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export const EditProvider: React.FC<EditProviderProps> = ({ 
  children,
  isAdmin = false
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentEditingSection, setCurrentEditingSection] = useState<string | null>(null);

  return (
    <EditContext.Provider 
      value={{ 
        editMode, 
        setEditMode, 
        currentEditingSection, 
        setCurrentEditingSection,
        isUserAdmin: isAdmin
      }}
    >
      {children}
    </EditContext.Provider>
  );
};

export default EditProvider;
