import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Hospital, MapPin, FileImage, Upload } from 'lucide-react';

const AddHospital = () => {
  const navigate = useNavigate();
  const [hospitalData, setHospitalData] = useState({
    hospital_name: '',
    address: '',
    speciality: '',
    description: '',
    images: []
  });
  const [loading, setLoading] = useState(false);

  const specialities = [
    'General Physician',
    'Gynecologist',
    'Pediatrician',
    'Neurologist',
    'Cardiologist',
    'Dermatologist'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHospitalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Validate file sizes
      const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024); // 5MB limit
      if (validFiles.length !== files.length) {
        alert('Some files are too large. Maximum size is 5MB per image.');
      }
      setHospitalData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('hospital_name', hospitalData.hospital_name);
      formData.append('address', hospitalData.address);
      formData.append('speciality', hospitalData.speciality);
      formData.append('description', hospitalData.description);
      
      hospitalData.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const response = await fetch('http://localhost:3001/api/hospitals', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Hospital added successfully!');
        navigate('/adminhome');
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error adding hospital:', error);
      alert('Failed to add hospital. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">Add New Hospital</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hospital Name
              </label>
              <div className="relative">
                <Hospital className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="hospital_name"
                  value={hospitalData.hospital_name}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <textarea
                  name="address"
                  value={hospitalData.address}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Speciality
              </label>
              <select
                name="speciality"
                value={hospitalData.speciality}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Speciality</option>
                {specialities.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={hospitalData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hospital Image
              </label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              {hospitalData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {hospitalData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Adding Hospital...' : 'Add Hospital'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/adminhome')}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddHospital;