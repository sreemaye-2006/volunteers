const API_URL = 'http://localhost:5000/api';

export const registerVolunteer = async (data) => {
  const response = await fetch(`${API_URL}/volunteers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Registration failed');
  }
  return resData;
};

export const loginAdmin = async (username, password) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Login failed');
  }
  return resData;
};

export const getVolunteers = async (token, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.skill) params.append('skill', filters.skill);
  if (filters.search) params.append('search', filters.search);

  const response = await fetch(`${API_URL}/volunteers?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Failed to fetch volunteers');
  }
  return resData;
};

export const updateVolunteerStatus = async (token, id, status) => {
  const response = await fetch(`${API_URL}/volunteers/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Failed to update status');
  }
  return resData;
};

export const deleteVolunteer = async (token, id) => {
  const response = await fetch(`${API_URL}/volunteers/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Failed to delete volunteer');
  }
  return resData;
};
