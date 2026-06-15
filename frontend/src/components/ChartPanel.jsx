import React from 'react';

const ChartPanel = ({ volunteers = [] }) => {
  // 1. Calculate Skills Distribution
  const skillCounts = {};
  volunteers.forEach(v => {
    if (v.skills && Array.isArray(v.skills)) {
      v.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    }
  });

  const sortedSkills = Object.entries(skillCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5 skills

  const maxSkillCount = sortedSkills.length > 0 ? Math.max(...sortedSkills.map(s => s.count)) : 1;

  // 2. Calculate Availability Distribution
  const availabilityCounts = { Weekdays: 0, Weekends: 0, Both: 0 };
  volunteers.forEach(v => {
    if (v.availability && availabilityCounts[v.availability] !== undefined) {
      availabilityCounts[v.availability]++;
    }
  });

  const availabilityData = Object.entries(availabilityCounts).map(([key, count]) => ({
    label: key,
    count,
  }));
  const maxAvailabilityCount = Math.max(...availabilityData.map(d => d.count), 1);

  return (
    <div className="charts-grid">
      {/* Skills Chart */}
      <div className="glass-panel chart-container">
        <h3 className="chart-title">Top Skills Among Volunteers</h3>
        {sortedSkills.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No skill data available
          </div>
        ) : (
          <div className="chart-visual-bars">
            {sortedSkills.map(({ skill, count }) => {
              const pct = (count / maxSkillCount) * 100;
              return (
                <div key={skill} className="chart-bar-row">
                  <span className="chart-bar-label" title={skill}>{skill}</span>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className="chart-bar-value">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Availability Chart */}
      <div className="glass-panel chart-container">
        <h3 className="chart-title">Volunteer Availability</h3>
        <div className="chart-visual-bars">
          {availabilityData.map(({ label, count }) => {
            const pct = (count / maxAvailabilityCount) * 100;
            return (
              <div key={label} className="chart-bar-row">
                <span className="chart-bar-label">{label}</span>
                <div className="chart-bar-track">
                  <div 
                    className="chart-bar-fill" 
                    style={{ 
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, var(--accent-cyan) 0%, var(--primary) 100%)'
                    }}
                  ></div>
                </div>
                <span className="chart-bar-value">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartPanel;
