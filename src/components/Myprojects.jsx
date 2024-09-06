import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ProjectCard from './ProjectCard';
import axios from 'axios';

function MyProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    setError('No access token found. Please log in.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:8000/api/v1/offer/', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                const fetchedProjects = response.data?.data || [];
                setProjects(fetchedProjects);
            } catch (err) {
                setError('Failed to fetch projects. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="bg-gray-100 min-h-screen">
                <Navbar />
                <div className="text-black flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-100 min-h-screen">
                <Navbar />
                <div className="text-black flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="text-black flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
                {projects.length === 0 ? (
                    <p>No available projects</p>
                ) : (
                    projects
                        .filter(project => project.status != 'available')
                        .map((project, index) => (
                            <ProjectCard key={index} project={project} />
                        ))
                )}
            </div>
        </div>
    );
}

export default MyProjects;
