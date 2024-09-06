// FindProjects.js
import React, { useState, useEffect } from 'react';
import Navbar2 from './Navbar2';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';
import axios from 'axios';

function FindFreelancers() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);

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

    const fetchProjectDetails = async (projectId) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`http://localhost:8000/api/v1/offer/get-offer/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const fetchedProjectDetails = response.data?.data || null;
            setSelectedProjectDetails(fetchedProjectDetails);
        } catch (err) {
            setError('Failed to fetch project details. Please try again later.');
        }
    };

    const handleProjectClick = (projectId) => {
        fetchProjectDetails(projectId);
        setSelectedProject(projectId);
    };

    const handleCloseDetail = () => {
        setSelectedProject(null);
        setSelectedProjectDetails(null);
    };

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
                {selectedProject ? (
                    <ProjectDetail
                        project={selectedProjectDetails}
                        onClose={handleCloseDetail}
                    />
                ) : (
                    projects.length === 0 ? (
                        <p>No available projects</p>
                    ) : (
                        projects
                            .filter(project => project.status === 'available')
                            .map((project) => (
                                <ProjectCard
                                    className='cursor-pointer'
                                    key={project._id}
                                    project={project}
                                    onClick={() => handleProjectClick(project._id)}
                                />
                            ))
                    )
                )}
            </div>
        </div>
    );
}

export default FindFreelancers;
