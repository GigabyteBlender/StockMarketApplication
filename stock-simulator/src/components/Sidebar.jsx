import React from 'react';
import { PieChart, Briefcase, TrendingUp, Clock } from 'lucide-react';
import './styles/Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <button
          className={`sidebar-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <PieChart size={20} />
          <span className="sidebar-button-text">Dashboard</span>
        </button>

        <button
          className={`sidebar-button ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          <Briefcase size={20} />
          <span className="sidebar-button-text">Portfolio</span>
        </button>

        <button
          className={`sidebar-button ${activeTab === 'market' ? 'active' : ''}`}
          onClick={() => setActiveTab('market')}
        >
          <TrendingUp size={20} />
          <span className="sidebar-button-text">Market</span>
        </button>

        <button
          className={`sidebar-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={20} />
          <span className="sidebar-button-text">History</span>
        </button>
      </nav>
    </aside>
  );
}