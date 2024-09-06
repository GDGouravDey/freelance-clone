import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProjectDetail({ project, onClose }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [applicantDetails, setApplicantDetails] = useState({});

    useEffect(() => {
        const fetchApplicants = async () => {
            if (project && project._id) {
                try {
                    const response = await axios.get(`http://localhost:8000/api/v1/freelance/find-applicants/${project._id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                    console.log("Applicants:", response.data.data);
                    setApplicants(response.data.data);
                    
                    // Fetch details for each applicant
                    response.data.data.forEach(applicant => {
                        fetchApplicantDetails(applicant.applicant._id);
                    });
                    
                    
                } catch (error) {
                    console.log("An error occurred while fetching the applicants.");
                }
            }
        };

        fetchApplicants();
    }, [project]);

const fetchApplicantDetails = async (applicantId) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/v1/user/employee/${applicantId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        console.log("Response Data:", response.data);

        setApplicantDetails(prevDetails => {
            // console.log("Previous Applicant Details:", prevDetails);

            return {
                ...prevDetails,
                [applicantId]: response.data
            };
        });
        // console.log("Current applicantDetails:", applicantDetails);
    } catch (error) {
        console.error("Error fetching applicant details:", error);
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
        project.skills.forEach(skill => formData.append("required_skills", skill));

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

    const {
        _id,
        title,
        description,
        employer,
        skills,
        minSalary,
        maxSalary,
        finalSalary,
        duration,
        status,
    } = project || {};

    const getStatusColor = () => {
        switch (status) {
            case 'completed':
                return 'bg-green-100';
            case 'in progress':
                return 'bg-yellow-100';
            default:
                return 'bg-white';
        }
    };

    return (
        <div className="relative shadow-lg rounded-lg p-6 min-w-[50%] mx-auto my-4">
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
                    <strong>Skills Required: </strong>
                    {skills && skills.map(skill => (
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
                    <button className='inline-block px-4 py-1 rounded text-white ml-[65%] bg-blue-500'>Apply</button>
                </div>
                
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 mt-6">
                <h3 className="text-lg font-bold mb-2">Apply for this job:</h3>
                
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 mt-6">
                <h3 className="text-lg font-bold mb-2">Applicants:</h3>
                {applicants.length === 0 ? (
                    <p>No applicants yet.</p>
                ) : (
                    applicants.map((applicant) => (
                        <div key={applicant._id} className="mb-4 border-2 pb-2 rounded-xl p-5">
                            <h4 className="text-md font-semibold">Proposed Rate: ${applicant.proposedRate}</h4>
                            {applicantDetails[applicant.applicant._id] && (
                                <>
                                    <p>Username: {applicantDetails[applicant.applicant._id].username}</p>
                                    <p>Email: {applicantDetails[applicant.applicant._id].email}</p>
                                    <div className="mb-2">
                                        <strong>Skills: </strong>
                                        {applicantDetails[applicant.applicant._id].skills && applicantDetails[applicant.applicant._id].skills.map(skill => (
                                            <span key={skill} className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div> 

            <div className="bg-white shadow-md rounded-lg p-4 mt-6">
                <h3 className="text-lg font-bold mb-2">Skill Gap Analysis</h3>
                <form onSubmit={handleSubmit} className="space-y-4 flex gap-x-9">
                    <div>
                        <label htmlFor="pdf_file" className="block text-sm font-medium text-gray-700">
                            Select Resume (PDF)
                        </label>
                        <input
                            id="pdf_file"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="mt-2 block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                    >
                        Upload and Analyze Resume
                    </button>
                </form>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {result && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-2">Results</h2>
                        <p><strong>Matched Skills:</strong> {result.matched_skills.join(", ")}</p>
                        <p><strong>Missing Skills:</strong> {result.missing_skills.join(", ")}</p>
                        <p><strong>Match Score:</strong> {result.match_score.toFixed(2)}%</p>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Skill Match Score</h3>
                            <img src={`data:image/png;base64,${result.pie_chart}`} alt="Pie chart showing skill match score" />
                        </div>
                        <h3 className="text-lg font-semibold mt-6">Suggested Courses</h3>
                        <ul>
                            {Object.entries(result.suggested_courses).map(([skill, course]) => (
                                <li key={skill}>
                                    <strong>{skill}:</strong> {course}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectDetail;