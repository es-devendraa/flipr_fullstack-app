import React, { useState } from 'react';
import axios from 'axios';

function ContactForm() {
  const [formData, setFormData] = useState({ fullName: '', email: '', mobileNumber: '', city: '' });
  const [message, setMessage] = useState('');
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api'  // Relative URL for monolith on Render
    : 'http://localhost:5000/api';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/contacts`, formData);
      setMessage('Thank you for your submission!');
      setFormData({ fullName: '', email: '', mobileNumber: '', city: '' });
    } catch (error) {
      setMessage('Error submitting form: ' + error.message);
    }
  };

  return (
    <section className="py-12 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="p-2 border rounded w-full" required />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded w-full" required />
          <input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Mobile Number" className="p-2 border rounded w-full" required />
          <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="p-2 border rounded w-full" required />
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded">Submit</button>
          {message && <p className="mt-2 text-center text-green-600">{message}</p>}
        </form>
      </div>
    </section>
  );
}

export default ContactForm;