/**
 * AccessibleCard component tests
 * Tests accessibility features, keyboard navigation, and overall functionality
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AccessibleCard } from '../AccessibleCard';

describe('AccessibleCard Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();
  
  const defaultProps = {
    title: 'Test Card',
    subtitle: 'Card Subtitle',
    onEdit: mockOnEdit,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
    testId: 'test-card',
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders correctly with all props', () => {
    render(
      <AccessibleCard {...defaultProps}>
        <p>Card content</p>
      </AccessibleCard>
    );
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });
  
  test('has proper ARIA attributes in view mode', () => {
    render(
      <AccessibleCard {...defaultProps}>
        <p>Card content</p>
      </AccessibleCard>
    );
    
    const card = screen.getByTestId('test-card');
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('aria-pressed', 'false');
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('aria-expanded', 'false');
  });
  
  test('enters edit mode on click and has proper ARIA attributes', () => {
    render(
      <AccessibleCard 
        {...defaultProps}
        editComponent={<div>Edit form</div>}
      >
        <p>Card content</p>
      </AccessibleCard>
    );
    
    const card = screen.getByTestId('test-card');
    fireEvent.click(card);
    
    expect(mockOnEdit).toHaveBeenCalled();
    expect(screen.getByText('Edit form')).toBeInTheDocument();
    expect(card).toHaveAttribute('aria-pressed', 'true');
    expect(card).toHaveAttribute('aria-expanded', 'true');
    
    // Edit mode shows action buttons
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
  
  test('enters edit mode on Enter key press', () => {
    render(
      <AccessibleCard 
        {...defaultProps}
        editComponent={<div>Edit form</div>}
      >
        <p>Card content</p>
      </AccessibleCard>
    );
    
    const card = screen.getByTestId('test-card');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(mockOnEdit).toHaveBeenCalled();
    expect(screen.getByText('Edit form')).toBeInTheDocument();
  });
  
  test('cancels edit mode on Escape key press', () => {
    render(
      <AccessibleCard 
        {...defaultProps}
        editComponent={<div>Edit form</div>}
      >
        <p>Card content</p>
      </AccessibleCard>
    );
    
    const card = screen.getByTestId('test-card');
    
    // Enter edit mode
    fireEvent.click(card);
    expect(screen.getByText('Edit form')).toBeInTheDocument();
    
    // Press Escape to cancel
    fireEvent.keyDown(card, { key: 'Escape' });
    expect(mockOnCancel).toHaveBeenCalled();
  });
  
  test('saves changes on Ctrl+Enter key press in edit mode', () => {
    render(
      <AccessibleCard 
        {...defaultProps}
        editComponent={<div>Edit form</div>}
      >
        <p>Card content</p>
      </AccessibleCard>
    );
    
    const card = screen.getByTestId('test-card');
    
    // Enter edit mode
    fireEvent.click(card);
    
    // Press Ctrl+Enter to save
    fireEvent.keyDown(card, { key: 'Enter', ctrlKey: true });
    expect(mockOnSave).toHaveBeenCalled();
  });
  
  test('disabled card cannot be clicked or focused', () => {
    render(
      <AccessibleCard 
        {...defaultProps}
        disabled={true}
      >
        <p>Card content</p>
      </AccessibleCard>
    );
    
    const card = screen.getByTestId('test-card');
    
    fireEvent.click(card);
    expect(mockOnEdit).not.toHaveBeenCalled();
    
    expect(card).toHaveAttribute('tabIndex', '-1');
    expect(card).toHaveAttribute('aria-disabled', 'true');
  });
  
  test('displays loading state correctly', () => {
    render(
      <AccessibleCard 
        {...defaultProps}
        loading={true}
      >
        <p>Card content</p>
      </AccessibleCard>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    const card = screen.getByTestId('test-card');
    expect(card).toHaveAttribute('aria-busy', 'true');
  });
  
  test('renders screen reader instructions for keyboard users', () => {
    render(
      <AccessibleCard {...defaultProps}>
        <p>Card content</p>
      </AccessibleCard>
    );
    
    // Test view mode instructions
    expect(screen.getByText('Press Enter to edit this item.')).toBeInTheDocument();
    
    // Enter edit mode and check updated instructions
    const card = screen.getByTestId('test-card');
    fireEvent.click(card);
    
    expect(screen.getByText('You are in edit mode. Press Escape to cancel or Control+Enter to save changes.')).toBeInTheDocument();
  });
});
