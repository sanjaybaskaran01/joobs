import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import JobList from './components/JobList';
import Achievements from './components/Achievements';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'jobs':
        return <JobList />;
      case 'achievements':
        return <Achievements />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      {renderCurrentView()}
      
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Dashboard</span>
        </button>
        
        <button 
          className={`nav-item ${currentView === 'jobs' ? 'active' : ''}`}
          onClick={() => setCurrentView('jobs')}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-label">Jobs</span>
        </button>
        
        <button 
          className={`nav-item ${currentView === 'achievements' ? 'active' : ''}`}
          onClick={() => setCurrentView('achievements')}
        >
          <span className="nav-icon">🏆</span>
          <span className="nav-label">Achievements</span>
        </button>
      </nav>
    </div>
  );
}

export default App;