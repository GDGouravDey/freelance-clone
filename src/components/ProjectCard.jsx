// ProjectCard.js
import React from 'react';

function ProjectCard({ project, className, onClick }) {
    const {
        title,
        description,
        employer,
        skills,
        minSalary,
        maxSalary,
        finalSalary,
        duration,
        status,
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
        <div
            className={`${getStatusColor()} ${className} shadow-lg rounded-lg p-6 min-w-[50%] mx-auto my-4`}
            onClick={onClick}
        >
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-700 mb-4">{description}</p>
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Employer:</h3>
                <p>{employer.username} ({employer.email})</p>
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
                <strong>{`${status === 'available' ? 'Salary Range: ' : 'Salary: '}`}</strong>{`${status === 'available' ? '$'+minSalary + ' - ' + '$'+maxSalary : '$'+finalSalary}`}
            </div>
            <div className="mb-4">
                <strong>Duration: </strong>{duration+' weeks'}
            </div>
            <div>
                <strong>Status: </strong>
                <span className={`inline-block px-2 py-0.5 rounded text-white ${
                    status === 'available' ? 'bg-green-500' :
                    status === 'in progress' ? 'bg-yellow-500' :
                    'bg-blue-500'
                }`}>
                    {status}
                </span>
            </div>
        </div>
    );
}

export default ProjectCard;
