import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProjectDetail2({ project, onClose }) {
    const [employerDetails, setEmployerDetails] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [requiredSkills, setRequiredSkills] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (project && project.employer) {
            fetchEmployeeDetails(project.employer._id);
        }
    }, [project]);

    const fetchEmployeeDetails = async (employeeId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/user/employee/${employeeId}`);
            const result = await response.json();

            if (response.ok) {
                setEmployerDetails(result.data);
            } else {
                console.error('Error:', result.message); // Display error message
            }
        } catch (error) {
            console.error('Error fetching employee details:', error);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("pdf_file", selectedFile);

        skills.forEach(skill => {
            formData.append("required_skills", skill);
        });

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post("http://localhost:3000/parse_resume/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setResult(response.data);
        } catch (error) {
            setError("An error occurred while processing the resume.");
        } finally {
            setLoading(false);
        }
    };

    if (!project) {
        return null; // Or you can show a loading state
    }

    const {
        title,
        description,
        skills,
        minSalary,
        maxSalary,
        finalSalary,
        duration,
        status,
        applicants = [], // Assuming `applicants` array is part of the project object
    } = project;

    const getStatusColor = () => {
        switch (status) {
            case 'completed':
                return 'bg-green-100'; // Light green for completed projects
            case 'in progress':
                return 'bg-yellow-100'; // Light yellow for in-progress projects
            default:
                return 'bg-white'; // White for open projects
        }
    };

    return (
        <div className="relative shadow-lg bg-gray-200 max-w-[48vw] rounded-lg p-6 min-w-[50%] mx-auto my-4">
            <button
                onClick={onClose}
                className="absolute top-0 right-0 text-white font-bold text-xl bg-red-600 px-3 py-1.5 rounded-[50px] m-2"
            >
                X
            </button>
            <div className={`${getStatusColor()} shadow-md rounded-lg p-4`}>
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="text-gray-700 mb-4">{description}</p>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Employer:</h3>
                    {employerDetails ? (
                        <p>{employerDetails.username} ({employerDetails.email})</p>
                    ) : (
                        <p>Loading employer details...</p>
                    )}
                </div>
                <div className="mb-4">
                    <strong>Skills Required: </strong>
                    {skills.map(skill => (
                        <span key={skill} className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                            {skill}
                        </span>
                    ))}
                </div>
                <div className="mb-4">
                    <strong>{`${status === 'available' ? 'Salary Range: ' : 'Salary: '}`}</strong>{`${status === 'available' ? '$' + minSalary + ' - ' + '$' + maxSalary : '$' + finalSalary}`}
                </div>
                <div className="mb-4">
                    <strong>Duration: </strong>{duration + ' weeks'}
                </div>
                <div>
                    <strong>Status: </strong>
                    <span className={`inline-block px-2 py-0.5 rounded text-white ${status === 'available' ? 'bg-green-500' :
                        status === 'in progress' ? 'bg-yellow-500' :
                            'bg-blue-500'
                        }`}>
                        {status}
                    </span>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 mt-6">
                <h3 className="text-lg font-bold mb-2">Applicants:</h3>
                {applicants.length === 0 ? (
                    <p>No applicants yet.</p>
                ) : (
                    applicants.map((applicant) => (
                        <div key={applicant._id} className="mb-4 border-b pb-2">
                            <h4 className="text-md font-semibold">{applicant.name}</h4>
                            <p>Email: {applicant.email}</p>
                            <div className="mb-2">
                                <strong>Skills: </strong>
                                {applicant.skills.map(skill => (
                                    <span key={skill} className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}

export default ProjectDetail2;
