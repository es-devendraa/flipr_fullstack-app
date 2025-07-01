import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProjectsSection from './components/ProjectsSection.jsx';
import ClientsSection from './components/ClientsSection.jsx';
import ContactForm from './components/ContactForm.jsx';
import Newsletter from './components/Newsletter.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

const LandingPage = () => {

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <Navbar scrollToSection={scrollToSection} />
      <section id="projects">
        <ProjectsSection />
      </section>
      <section id="clients">
        <ClientsSection />
      </section>
      <section id="contact-us">
        <ContactForm />
      </section>
      <section id="newsletter">
        <Newsletter />
      </section>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
