import React, { useState } from 'react';
import axios from 'axios';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api'  // Relative URL for monolith on Render
    : 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/subscriptions`, { email });
      setMessage('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      setMessage('Error subscribing: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <section className="py-12 bg-white">
      <h2 className="text-3xl font-bold text-center mb-6">Newsletter</h2>
      <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="p-2 border rounded w-full" required />
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded">Subscribe</button>
          {message && <p className="mt-2 text-center text-green-600">{message}</p>}
        </form>
      </div>
    </section>
  );
}

export default Newsletter;