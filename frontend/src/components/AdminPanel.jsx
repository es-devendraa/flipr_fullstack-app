import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
  // Configure API base URL based on environment
  // In production, use relative URLs since frontend and backend are served from same domain
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api'  // Relative URL - no CORS issues
    : 'http://localhost:5000/api';

  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedType, setSelectedType] = useState('projects');
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    setMessage('Logged out');
    setFormData({});
    setSelectedType('projects');
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData('projects');
      fetchData('clients');
      fetchData('contacts');
      fetchData('subscriptions');
    }
  }, [isAuthenticated]);

  const fetchData = async (type) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${type}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      switch (type) {
        case 'projects': setProjects(response.data); break;
        case 'clients': setClients(response.data); break;
        case 'contacts': setContacts(response.data); break;
        case 'subscriptions': setSubscriptions(response.data); break;
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        setMessage('Session expired. Please log in again.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Register data:', credentials);
    try {
      await axios.post(`${API_BASE_URL}/admin/register`, credentials);
      setMessage('Registration successful. Please log in.');
      setIsRegistering(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, credentials);
      localStorage.setItem('token', response.data.token);
      setMessage(response.data.message);
      setIsAuthenticated(true);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  const handleAddEdit = async (e) => {
    e.preventDefault();
    try {
      const url = formData._id
        ? `${API_BASE_URL}/${selectedType}/${formData._id}`
        : `${API_BASE_URL}/${selectedType}`;
      const method = formData._id ? 'put' : 'post';

      if (selectedType === 'contacts' || selectedType === 'subscriptions') {
        const payload = selectedType === 'contacts'
          ? {
              fullName: formData.fullName || '',
              email: formData.email || '',
              mobileNumber: formData.mobileNumber || '',
              city: formData.city || '',
            }
          : { email: formData.email || '' };
        await axios[method](url, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        const data = new FormData();
        data.append('name', formData.name || '');
        data.append('description', formData.description || '');
        if (formData.image) data.append('image', formData.image);
        if (selectedType === 'clients' && formData.designation)
          data.append('designation', formData.designation);
        await axios[method](url, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }

      fetchData(selectedType);
      setFormData({
        _id: '',
        name: '',
        description: '',
        image: null,
        designation: '',
        email: '',
        fullName: '',
        mobileNumber: '',
        city: '',
      });
      setEditMode(false);
      setMessage('Action successful');
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${selectedType}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchData(selectedType);
      setMessage('Deleted successfully');
    } catch (error) {
      setMessage('Error deleting: ' + error.message);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-indigo-600 text-white p-4 fixed w-full top-0 z-10">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-full mr-4"></div> {/* Placeholder for logo */}
              <h1 className="text-2xl font-bold">Admin Portal</h1>
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <button onClick={() => scrollToSection('login')} className="hover:underline">
                    Login
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="pt-20 pb-8">
          <section id="login" className="py-12">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Admin Login/Registration</h2>
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
              <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                <input
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="p-2 border rounded w-full"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="p-2 border rounded w-full"
                  required
                />
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded">
                  {isRegistering ? 'Register' : 'Login'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setMessage('');
                    setCredentials({ username: '', password: '' });
                  }}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded mt-2"
                >
                  {isRegistering ? 'Switch to Login' : 'Switch to Register'}
                </button>
                {message && <p className="mt-2 text-center text-red-600">{message}</p>}
              </form>
            </div>
          </section>
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>© 2025 Admin Portal. All rights reserved. | Contact: support@adminportal.com</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4 fixed w-full top-0 z-10">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full mr-4"></div> {/* Placeholder for logo */}
            <h1 className="text-2xl font-bold">Admin Portal</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button onClick={handleLogout} className="hover:underline">
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="pt-20 pb-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Admin Panel</h2>
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setFormData({});
              setEditMode(false);
            }}
            className="mb-4 p-2 border rounded"
          >
            <option value="projects">Projects</option>
            <option value="clients">Clients</option>
            <option value="contacts">Contacts</option>
            <option value="subscriptions">Subscriptions</option>
          </select>

          <form onSubmit={handleAddEdit} className="space-y-4 mb-6">
            {selectedType === 'subscriptions' && (
              <input
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder="Email"
                className="p-2 border rounded w-full"
              />
            )}
            {selectedType === 'contacts' && (
              <>
                <input
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="p-2 border rounded w-full"
                />
                <input
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="Email"
                  className="p-2 border rounded w-full"
                />
                <input
                  name="mobileNumber"
                  value={formData.mobileNumber || ''}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="p-2 border rounded w-full"
                />
                <input
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  placeholder="City"
                  className="p-2 border rounded w-full"
                />
              </>
            )}
            {(selectedType === 'projects' || selectedType === 'clients') && (
              <>
                <input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder="Name"
                  className="p-2 border rounded w-full"
                />
                <input
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  placeholder="Description"
                  className="p-2 border rounded w-full"
                />
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                  accept="image/*"
                />
                {selectedType === 'clients' && (
                  <input
                    name="designation"
                    value={formData.designation || ''}
                    onChange={handleChange}
                    placeholder="Designation"
                    className="p-2 border rounded w-full"
                  />
                )}
              </>
            )}
            <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded">
              {editMode ? 'Update' : 'Add'}
            </button>
          </form>

          <div>
            {selectedType === 'projects' &&
              projects.map((p) => (
                <div key={p._id} className="flex items-center space-x-2 mb-2 p-2 bg-gray-50 rounded">
                  <span>{p.name} {p.image && <img src={p.image} alt={p.name} width="50" />}</span>
                  <button
                    onClick={() => {
                      setFormData(p);
                      setEditMode(true);
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}

            {selectedType === 'clients' &&
              clients.map((c) => (
                <div key={c._id} className="flex items-center space-x-2 mb-2 p-2 bg-gray-50 rounded">
                  <span>{c.name} {c.image && <img src={c.image} alt={c.name} width="50" />}</span>
                  <button
                    onClick={() => {
                      setFormData(c);
                      setEditMode(true);
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}

            {selectedType === 'contacts' &&
              contacts.map((c) => (
                <div key={c._id} className="flex items-center space-x-4 mb-2 p-2 bg-gray-50 rounded">
                  <span className="font-bold">{c.fullName}</span>
                  <span>{c.email}</span>
                  <span>{c.mobileNumber}</span>
                  <span>{c.city}</span>
                  <button
                    onClick={() => {
                      setFormData(c);
                      setEditMode(true);
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}

            {selectedType === 'subscriptions' &&
              subscriptions.map((s) => (
                <div key={s._id} className="flex items-center space-x-2 mb-2 p-2 bg-gray-50 rounded">
                  <span>{s.email}</span>
                  <button
                    onClick={() => {
                      setFormData(s);
                      setEditMode(true);
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>

          {message && <p className="mt-2 text-center text-green-600">{message}</p>}
        </div>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2025 Admin Portal. All rights reserved. | Contact: support@adminportal.com</p>
      </footer>
    </div>
  );
}

export default AdminPanel;