import React from 'react';
import { PieChart, Briefcase, TrendingUp, Clock, Activity, Settings, User } from 'lucide-react';
import './styles/Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart, description: 'Overview & Analytics' },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, description: 'Your Holdings' },
    { id: 'market', label: 'Markets', icon: TrendingUp, description: 'Live Trading' },
    { id: 'history', label: 'History', icon: Clock, description: 'Trade History' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-header">
          <div className="nav-title">Navigation</div>
          <div className="nav-indicator"></div>
        </div>
        
        <nav className="sidebar-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="nav-item-content">
                  <div className="nav-icon-wrapper">
                    <Icon className="nav-icon" size={20} />
                    {isActive && <div className="icon-glow"></div>}
                  </div>
                  <div className="nav-text">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                </div>
                {isActive && <div className="active-indicator"></div>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-divider"></div>

        <div className="sidebar-footer">
          <div className="user-section">
            <div className="user-avatar">
              <User size={18} />
              <div className="avatar-status"></div>
            </div>
            <div className="user-info">
              <div className="user-name">Trader Pro</div>
              <div className="user-status">
                <Activity size={12} />
                <span>Active</span>
              </div>
            </div>
          </div>
          
          <button className="settings-button">
            <Settings size={18} />
          </button>
        </div>
      </div>
      
      <div className="sidebar-bg-pattern"></div>
    </aside>
  );
}