import Volunteer from '../models/Volunteer.js';

// @desc    Register a new volunteer
// @route   POST /api/volunteers
// @access  Public
export const registerVolunteer = async (req, res) => {
  const { fullName, email, phone, age, skills, occupation, availability, hoursPerWeek, motivation } = req.body;

  try {
    const volunteerExists = await Volunteer.findOne({ email });

    if (volunteerExists) {
      return res.status(400).json({ message: 'A volunteer with this email already exists' });
    }

    const volunteer = await Volunteer.create({
      fullName,
      email,
      phone,
      age,
      skills: Array.isArray(skills) ? skills : [skills],
      occupation,
      availability,
      hoursPerWeek,
      motivation,
    });

    if (volunteer) {
      res.status(201).json({
        message: 'Registration successful! Thank you for volunteering.',
        data: volunteer,
      });
    } else {
      res.status(400).json({ message: 'Invalid volunteer data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all volunteers with filters
// @route   GET /api/volunteers
// @access  Private (Admin)
export const getVolunteers = async (req, res) => {
  try {
    const { status, skill, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (skill) {
      query.skills = { $in: [skill] };
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { occupation: { $regex: search, $options: 'i' } },
      ];
    }

    const volunteers = await Volunteer.find(query).sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update volunteer registration status
// @route   PATCH /api/volunteers/:id/status
// @access  Private (Admin)
export const updateVolunteerStatus = async (req, res) => {
  const { status } = req.body;

  if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (volunteer) {
      volunteer.status = status;
      const updatedVolunteer = await volunteer.save();
      res.json(updatedVolunteer);
    } else {
      res.status(404).json({ message: 'Volunteer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a volunteer profile
// @route   DELETE /api/volunteers/:id
// @access  Private (Admin)
export const deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (volunteer) {
      await volunteer.deleteOne();
      res.json({ message: 'Volunteer profile removed' });
    } else {
      res.status(404).json({ message: 'Volunteer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
