import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ClientsSection() {
  const [clients, setClients] = useState([]);
  // Define API_BASE_URL to match AdminPanel.jsx
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api'  // Relative URL for monolith on Render
    : 'http://localhost:5000/api';

  useEffect(() => {
    axios.get(`${API_BASE_URL}/clients`)
      .then((response) => setClients(response.data))
      .catch((error) => console.error('Error fetching clients:', error));
  }, []);

  return (
    <section className="py-12 bg-white">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Happy Clients</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {clients.map((client) => (
          <div key={client._id} className="bg-gray-50 rounded-lg shadow-md p-6 text-center">
            <img src={client.image} alt={client.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
            <h3 className="text-xl font-semibold text-gray-800">{client.name}</h3>
            <p className="text-sm text-gray-600">{client.designation}</p>
            <p className="mt-2 text-gray-500">{client.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ClientsSection;