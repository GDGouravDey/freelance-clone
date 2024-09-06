import React, { useState, useEffect } from 'react';
import Navbar2 from './Navbar2';
import ProjectCard from './ProjectCard';
import ProjectDetail2 from './ProjectDetail2'; // Import the ProjectDetail component
import axios from 'axios';

function MyProjects2() {
    const [projects, setProjects] = useState([]);
    const [selectedProjectDetails, setSelectedProjectDetails] = useState(null); // Track selected project details
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

                const response = await axios.get('http://localhost:8000/api/v1/freelance/find-all-jobs', {
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

    // Handle project card click and fetch the selected project details
    const handleProjectClick = async (projectId) => {
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
            setError('Failed to fetch project details.');
        }
    };

    const handleCloseDetail = () => {
        setSelectedProjectDetails(null);
    };

    if (loading) {
        return (
            <div className="bg-gray-100 min-h-screen">
                <Navbar2 />
                <div className="text-black flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-100 min-h-screen">
                <Navbar2 />
                <div className="text-black flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar2 />
            <div className="text-black flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
                {selectedProjectDetails ? (
                    <ProjectDetail2
                        project={selectedProjectDetails}
                        onClose={handleCloseDetail}
                    />
                ) : (
                    projects.length === 0 ? (
                        <p>No available projects</p>
                    ) : (
                        projects
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

export default MyProjects2;
