import React, { useState } from 'react';
import { Upload,Hospital, User, Mail, Lock, Phone, Award, Calendar, Heart, FileText, Stethoscope } from 'lucide-react';

const DoctorForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    speciality: '',
    department: '',
    experience: '',
    successStory: '',
    certificates: [],
    profile_photo: null
  });

  const [certificateFields, setCertificateFields] = useState([
    { name: '', authority: '', startDate: '', endDate: '' }
  ]);

  const departments = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Dermatology',
    'General Medicine',
    'Oncology',
    'Ophthalmology',
    'ENT'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCertificateChange = (index, field, value) => {
    const newCertificates = [...certificateFields];
    newCertificates[index][field] = value;
    setCertificateFields(newCertificates);
  };

  const handleFileUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newCertificates = [...formData.certificates];
      newCertificates[index] = file;
      setFormData(prev => ({
        ...prev,
        certificates: newCertificates
      }));
    }
  };

  const addCertificateField = () => {
    setCertificateFields([
      ...certificateFields,
      { name: '', authority: '', startDate: '', endDate: '' }
    ]);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      
      // Append all text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('speciality', formData.speciality);
      formDataToSend.append('hospital', formData.hospital);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('successStory', formData.successStory);
      formDataToSend.append('certificates', JSON.stringify(certificateFields));
  
      // Append profile photo if exists
      if (formData.profile_photo) {
        formDataToSend.append('profile_photo', formData.profile_photo);
      }
  
      const response = await fetch('http://localhost:3001/api/doctor-signup', {
        method: 'POST',
        body: formDataToSend // Send as FormData instead of JSON
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Doctor registration successful!');
        // Clear form or redirect
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during doctor registration:', error);
      alert('Registration failed. Please try again.');
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg rounded-lg">
      
      
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Information */}
         {/* Name Field */}
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter your full name"
            />
          </div>
        </div>

       {/* Email Field */}
       <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter your email"
            />
          </div>
        </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        

        {/* Gender Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Female
            </label>
          </div>
        </div>


        {/* Hospital name*/}
        <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
         Hospital Name
       </label>
       <div className="relative">
         <Hospital className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
         <input
          type="name"
          name="hospital"
          value={formData.hospital}
           onChange={handleInputChange}
           className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
           />
        </div>
      </div>
        {/* Professional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Speciality
            </label>
            <select
              name="speciality"
              value={formData.speciality}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Speciality</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Years</option>
              {[...Array(40)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1} years</option>
              ))}
            </select>
          </div>
        </div>

        {/* Certificates */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Certificates</h3>
            <button
              type="button"
              onClick={addCertificateField}
              className="text-blue-600 hover:text-blue-700"
            >
              + Add Certificate
            </button>
          </div>

          {certificateFields.map((cert, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Certificate Name"
                  value={cert.name}
                  onChange={(e) => handleCertificateChange(index, 'name', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Issuing Authority"
                  value={cert.authority}
                  onChange={(e) => handleCertificateChange(index, 'authority', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="date"
                  placeholder="Start Date"
                  value={cert.startDate}
                  onChange={(e) => handleCertificateChange(index, 'startDate', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={cert.endDate}
                  onChange={(e) => handleCertificateChange(index, 'endDate', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-gray-400" />
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, index)}
                  className="w-full"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Success Story */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Success Story
          </label>
          <textarea
            name="successStory"
            value={formData.successStory}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
            placeholder="Share your notable achievements and success stories..."
          />
        </div>


        {/* Profile Photo Upload */}
<div className="mt-6">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Profile Photo
  </label>
  <div className="mt-1 flex items-center gap-4">
    <div className="w-24 h-24 border-2 border-gray-300 rounded-full overflow-hidden">
      {formData.profile_photo ? (
        <img
          src={URL.createObjectURL(formData.profile_photo)}
          alt="Profile Preview"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <User className="h-12 w-12 text-gray-400" />
        </div>
      )}
    </div>
    <input
      type="file"
      name="profile_photo"
      accept="image/jpeg,image/png,image/jpg"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          const file = e.target.files[0];
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('File size should be less than 5MB');
            return;
          }
          setFormData(prev => ({
            ...prev,
            profile_photo: file
          }));
        }
      }}
      className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100"
    />
  </div>
  <p className="mt-2 text-sm text-gray-500">
    Upload a professional photo. JPG, PNG up to 5MB
  </p>
</div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Register as Doctor
        </button>
      </form>
    </div>
  );
};

export default DoctorForm;