import React, { useState } from 'react';
import { registerVolunteer } from '../api';
import { ArrowRight, Sparkles } from 'lucide-react';

const AVAILABLE_SKILLS = [
  'Teaching',
  'Event Management',
  'Social Media Marketing',
  'Graphic Design',
  'Web Development',
  'Content Writing',
  'Fundraising',
  'Photography & Video',
  'Public Relations',
  'Counseling',
];

const RegistrationForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    skills: [],
    occupation: '',
    availability: '',
    hoursPerWeek: '',
    motivation: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillChange = (skill) => {
    setFormData((prev) => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerVolunteer({
        ...formData,
        age: Number(formData.age),
        hoursPerWeek: Number(formData.hoursPerWeek),
      });
      onSuccess(res.message || 'Thank you for registering!');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        skills: [],
        occupation: '',
        availability: '',
        hoursPerWeek: '',
        motivation: '',
      });
    } catch (err) {
      onError(err.message || 'Submission failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel form-container">
      <div className="form-header">
        <h2 style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #fff 0%, var(--text-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Become a Volunteer</h2>
        <p>Make a difference in the lives of underprivileged youth. Register today!</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div className="form-grid" style={{ gap: '1rem', padding: 0 }}>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                className="form-input"
                value={formData.age}
                onChange={handleChange}
                placeholder="18"
                min="13"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Hours / Week</label>
              <input
                type="number"
                name="hoursPerWeek"
                className="form-input"
                value={formData.hoursPerWeek}
                onChange={handleChange}
                placeholder="5"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Occupation</label>
            <select
              name="occupation"
              className="form-select"
              value={formData.occupation}
              onChange={handleChange}
              required
            >
              <option value="">Select Occupation</option>
              <option value="Student">Student</option>
              <option value="Employed">Employed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Availability</label>
            <select
              name="availability"
              className="form-select"
              value={formData.availability}
              onChange={handleChange}
              required
            >
              <option value="">Select Availability</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Weekends">Weekends</option>
              <option value="Both">Both (Weekdays & Weekends)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Skills & Areas of Interest</label>
          <div className="skills-selector">
            {AVAILABLE_SKILLS.map((skill) => (
              <label key={skill} className="skill-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={() => handleSkillChange(skill)}
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Why do you want to volunteer with Naye Pankh?</label>
          <textarea
            name="motivation"
            className="form-textarea"
            rows="4"
            value={formData.motivation}
            onChange={handleChange}
            placeholder="Share your passion, goals, and what you hope to contribute..."
            required
          ></textarea>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Submitting Registration...' : 'Submit Application'}
            <Sparkles size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
