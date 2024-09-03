import React, { useState } from 'react';
import Navbar from "../components/Navbar";

const ProfileForm = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleImageChange = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ profileImage, name, email, organization, phoneNumber });
  };

  return (
    <div id='nav-bar'>
    <Navbar />
    <div id='profile-form-page'>
    <div className="mt-10 max-w-lg mx-auto p-6 bg-gradient-to-br border-2 border-gray-500 shadow-xl rounded-lg backdrop-blur-md ">
      <h1 className="text-4xl font-bold mb-6 text-white text-center profile">Update Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="profileImage" className="block text-sm font-medium text-white">
            Profile Image
          </label>
          <input
            type="file"
            id="profileImage"
            onChange={handleImageChange}
            className="mt-2 block w-full text-sm text-white-900 border border-gray-300 rounded-lg p-2 cursor-pointer bg-white-800 hover:bg-gray-300 transition-colors duration-300"
          />
          {profileImage && (
            <div className="mt-4 flex justify-center">
              <img
                src={profileImage}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-white">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 block w-full text-sm text-white-900 border border-gray-100 rounded-lg p-2 cursor-pointer bg-white-800 hover:bg-gray-300 transition-colors duration-300 bg-transparent"
            placeholder="You Name"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-white">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block w-full text-sm text-white-900 border border-gray-100 rounded-lg p-2 cursor-pointer bg-white-800 hover:bg-gray-300 transition-colors duration-300 bg-transparent"
            placeholder="example@example.com"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="organization" className="block text-sm font-medium text-white">
            Organization Name
          </label>
          <input
            type="text"
            id="organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="mt-2 block w-full text-sm text-white-900 border border-gray-100 rounded-lg p-2 cursor-pointer bg-white-800 hover:bg-gray-300 transition-colors duration-300 bg-transparent"
            placeholder="Your Organization"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-white">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-2 block w-full text-sm text-white-900 border border-gray-100 rounded-lg p-2 cursor-pointer bg-white-800 hover:bg-gray-300 transition-colors duration-300 bg-transparent"
            placeholder="Enter phone number"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  </div>
  </div>
  );
};

export default ProfileForm;
