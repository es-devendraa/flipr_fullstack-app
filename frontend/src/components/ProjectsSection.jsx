import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api'  // Relative URL for monolith on Render
    : 'http://localhost:5000/api';

  useEffect(() => {
    axios.get(`${API_BASE_URL}/projects`)
      .then(response => setProjects(response.data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  return (
    <section className="py-12 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">Our Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {projects.map(project => (
          <div key={project._id} className="bg-white p-4 rounded shadow">
            {project.image && <img src={project.image} alt={project.name} className="w-full h-48 object-cover mb-4 rounded" />}
            <h3 className="text-xl font-semibold">{project.name}</h3>
            <p className="text-gray-600">{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectsSection;