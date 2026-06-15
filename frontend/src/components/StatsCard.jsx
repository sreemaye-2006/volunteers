import React from 'react';
import { Users, Globe, Smile, Sparkles } from 'lucide-react';

const StatsCard = () => {
  const stats = [
    { num: '2,500+', label: 'Registered Volunteers', icon: <Users size={24} className="text-primary" /> },
    { num: '25+', label: 'Active Projects', icon: <Sparkles size={24} className="text-primary" /> },
    { num: '15,000+', label: 'Lives Impacted', icon: <Smile size={24} className="text-primary" /> },
    { num: '10+', label: 'Cities Covered', icon: <Globe size={24} className="text-primary" /> },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, i) => (
        <div key={i} className="stat-card">
          <div style={{ 
            display: 'inline-flex', 
            padding: '0.75rem', 
            borderRadius: '12px', 
            background: 'var(--primary-light)', 
            color: 'var(--primary)', 
            marginBottom: '1rem' 
          }}>
            {stat.icon}
          </div>
          <div className="stat-num">{stat.num}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
