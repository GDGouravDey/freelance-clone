import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Resume = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
          console.error('No access token found');
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8000/api/v1/user/current-user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.data.username);
          setUserId(data.data._id);
          // Fetch resume URL
          fetchResumeUrl(data.data._id);
        } else {
          console.error('Failed to fetch current user:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchResumeUrl = async (userId) => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const response = await fetch(`http://localhost:8000/api/v1/resume/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setResumeUrl(data.data.resume); // Set the resume URL from the API
        } else {
          console.error('Failed to fetch resume URL:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching resume URL:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('application/pdf') || file.size > 1024 * 1024 * 5) {
      alert('Invalid file format or size. Please upload a PDF under 5MB.');
      return;
    }
    setPdfFile(file);
    setSkills([]);
    setRecommendations('');
    setChartData([]);
  };

  const updateResume = async (formData) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/resume/upload-resume', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update Resume Error:', errorData.message || 'Failed to update resume');
        throw new Error(errorData.message || 'Failed to update resume');
      }
    } catch (error) {
      console.error('Error updating resume:', error);
      alert('Error updating resume');
    }
  };

  const handleSaveSkills = async () => {
    const employeeId = userId;
    const accessToken = localStorage.getItem('accessToken');
  
    if (!accessToken) {
      console.error('No access token found');
      return;
    }
  
    try {
      console.log(skills);
      console.log(JSON.stringify({ skills }));
      
      
      const response = await fetch(`http://localhost:8000/api/v1/user/employee/${employeeId}/skills`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skills }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Skills updated successfully:', data);
        alert('Skills updated successfully!');
      } else {
        console.error('Failed to update skills:', response.statusText);
        alert('Failed to update skills.');
      }
    } catch (error) {
      console.error('Error updating skills:', error);
      alert('Error updating skills');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (pdfFile) {
        formData.append('resume', pdfFile);
      }

      // await updateResume(formData);

      const extractSkillsResponse = await fetch('http://localhost:8000/api/v1/extract-skills', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (extractSkillsResponse.ok) {
        const data = await extractSkillsResponse.json();
        const skillsArray = data.extractedText.match(/"([^"]*)"/g)?.map(skill => skill.replace(/"/g, '').trim()) || [];
        setSkills(skillsArray);
        await handleSubmit2();
      } else {
        console.error('Failed to extract skills:', extractSkillsResponse.statusText);
        alert('Failed to extract skills');
      }
    } catch (error) {
      console.error('Error during resume submission:', error);
      alert('Error during resume submission');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit2 = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/resume-recommend', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.extractedText.replace(/\*/g, ''));
        await handleSubmit3();
      } else {
        console.error('Failed to get recommendations:', response.statusText);
        alert('Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error during recommendation generation:', error);
      alert('Error during recommendation generation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit3 = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/generate-chart-1', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const chartArray = data.extractedText.match(/\[.*\]/s)[0];
        setChartData(JSON.parse(chartArray));
      } else {
        console.error('Failed to get chart data:', response.statusText);
        alert('Failed to get chart data');
      }
    } catch (error) {
      console.error('Error during chart data retrieval:', error);
      alert('Error during chart data retrieval');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSkillChange = (event) => {
    setNewSkill(event.target.value);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const SkillButton = ({ skill }) => (
    <button className="bg-blue-500 text-white py-1 px-3 rounded-full m-1 hover:bg-blue-600">
      {skill}
    </button>
  );

  const renderBarChart = (data) => (
    <BarChart width={1200} height={600} data={data}>
      <XAxis
        dataKey="Domain"
        stroke="#8884d8"
        angle={0}
        textAnchor="middle"
        height={200}
      />
      <YAxis />
      <Tooltip wrapperStyle={{ width: 170, backgroundColor: '#ccc' }} />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <Bar dataKey="Proficiency" fill="#8884d8" barSize={50} />
    </BarChart>
  );

  return (
    <div className="bg-gray-100 text-zinc-950 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
          <button
            type="submit"
            className="bg-[#8c52ff] text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Add a Skill:</h3>
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={handleNewSkillChange}
              placeholder="Enter a new skill"
              className="p-2 border border-gray-300 rounded bg-white"
            />
            <button
              onClick={addSkill}
              className="bg-violet-500 text-white font-bold py-2 px-4 rounded"
            >
              Add Skill
            </button>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Extracted Skills:</h3>
            <div className="flex flex-wrap">
              {skills.map((skill, index) => (
                <SkillButton key={index} skill={skill} />
              ))}
            </div>
            {/* <button
              onClick={handleSaveSkills}
              className="mt-4 bg-[#8c52ff] text-white font-bold py-2 px-4 rounded"
            >
              Save Skillset
            </button> */}
          </div>
        )}

        {recommendations && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Recommendations:</h3>
            <textarea
              value={recommendations}
              readOnly
              className="w-full h-[110vh] p-4 border border-gray-300 rounded bg-white"
            />
          </div>
        )}

        {chartData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Bar Chart:</h3>
            {renderBarChart(chartData)}
          </div>
        )}

        {isLoading && <div className="mt-4 text-center">Loading...</div>}
      </div>
    </div>
  );
};

export default Resume;
