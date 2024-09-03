import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar"; // Adjust the import path as necessary

const MyProjects = () => {
  
  const [projects, setProjects] = useState([
    {
      title: 'Sample Project',
      skills: 'JavaScript, React, Node.js',
      duration: '3 months',
      priceRange: '$1000 - $3000',
    },
  ]);

  useEffect(() => {
    // Fetch additional projects from backend
    fetch('/api/projects')  // Replace with your backend endpoint
      .then((response) => response.json())
      .then((data) => setProjects([...projects, ...data]))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  const addProject = () => {
    
    // Add a new project with default values (can be customized as needed)
    setProjects([
      ...projects,
      {
        title: 'New Project',
        skills: 'Python, Django, Docker',
        duration: '2 months',
        priceRange: '$2000 - $4000',
      },
    ]);
  };

  return (
    <div id='nav-bar'>
    <Navbar />
    
    <div id='my-projects-page' className="min-h-screen mt-1"> 
    
      <div
        className="flex flex-col items-center justify-center p-6"
        
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-screen-xl">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full"
            >
              <h2 className="text-xl font-bold mb-2">{project.title}</h2>
              <p className="text-base mb-1">Skills: {project.skills}</p>
              <p className="text-base mb-1">Duration: {project.duration}</p>
              <p className="text-base">Price Range: {project.priceRange}</p>
            </div>
          ))}
        </div>
        <button
          onClick={addProject}
          className="mt-8 py-3 px-6 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Add Project
        </button>
      </div>
    </div>
    </div>
  );
};

export default MyProjects;
