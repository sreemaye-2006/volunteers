import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [13, 'Must be at least 13 years old'],
  },
  skills: {
    type: [String],
    default: [],
  },
  occupation: {
    type: String,
    required: [true, 'Occupation is required'],
  },
  availability: {
    type: String,
    enum: ['Weekdays', 'Weekends', 'Both'],
    required: [true, 'Availability is required'],
  },
  hoursPerWeek: {
    type: Number,
    required: [true, 'Hours per week is required'],
    min: [1, 'Must commit at least 1 hour per week'],
  },
  motivation: {
    type: String,
    required: [true, 'Motivation statement is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);
export default Volunteer;
