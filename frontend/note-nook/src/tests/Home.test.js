import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../pages/Home/Home.jsx'; 
import '@testing-library/jest-dom';

describe('Home Component', () => {
  beforeEach(() => {
    render(
      <Router>
        <Home />
      </Router>
    );
    screen.debug(); 
  });

  test('renders the home title', () => {
    const titleElement = screen.getByText(/write, plan, organize, play/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the home description', () => {
    const descriptionElement = screen.getByText(/turn ideas into action with notes nook workspace/i);
    expect(descriptionElement).toBeInTheDocument();
  });

  
});
