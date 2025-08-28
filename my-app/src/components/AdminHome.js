import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { Hospital, ArrowLeft } from 'lucide-react';
const HospitalCard = React.memo(({ hospital, onDelete, onNavigate }) => (
  <Card className="hover:shadow-lg transition-all flex flex-col justify-between h-full relative overflow-hidden">
    <div className="w-full h-60">
      {hospital.imageData ? (
        <img
          src={`data:image/jpeg;base64,${hospital.imageData}`}
          alt={hospital.hospital_name}
          className="w-full h-full object-cover object-top"
          loading="lazy"
          style={{ backgroundColor: 'rgb(249, 250, 251)' }}
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <Hospital className="h-16 w-16 text-gray-400" />
        </div>
      )}
    </div>

    <CardContent className="p-6 flex flex-col flex-grow relative z-10 bg-white/60 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-2 text-gray-900">{hospital.hospital_name}</h2>
      <p className="text-gray-600 mb-2 font-medium">
        <strong>Address:</strong> {hospital.address}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Speciality:</strong> {hospital.speciality}
      </p>
      <p className="text-gray-600 flex-grow">{hospital.description}</p>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onNavigate(`/hospital-details/${hospital.id}`)}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          View Details
        </button>
        <button
          onClick={() => onNavigate(`/hospital-doctors/${hospital.id}`)}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          View doctors
        </button>
      </div>
      <div className="mt-4 flex justify-center"> {/* Centering the button */}
        <button
          onClick={() => onDelete(hospital.id)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Delete
        </button>
      </div>
    </CardContent>
  </Card>
));


const AdminHome = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHospitals = useCallback(async () => {
    try {
      const controller = new AbortController();
      const response = await fetch('http://localhost:3001/api/hospitals1', {
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setHospitals(data);
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error fetching hospitals:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  const handleDeleteHospital = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this hospital?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/hospitals1/${id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          setHospitals(prev => prev.filter(hospital => hospital.id !== id));
          alert('Hospital deleted successfully');
        } else {
          alert('Failed to delete hospital');
        }
      } catch (error) {
        console.error('Error deleting hospital:', error);
        alert('Error deleting hospital');
      }
    }
  }, []);

  const gridContent = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hospitals.map((hospital) => (
        <HospitalCard
          key={hospital.id}
          hospital={hospital}
          onDelete={handleDeleteHospital}
          onNavigate={navigate}
        />
      ))}
    </div>
  ), [hospitals, handleDeleteHospital, navigate]);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Dashboard Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 mt-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            {/* Back to Home Button on Left Side */}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </button>
            <h1 className="text-4xl font-bold text-blue-600 text-center flex-grow">Admin Dashboard</h1>
          </div>

          {loading ? (
            <div className="text-center">Loading hospitals...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : gridContent}

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/add-hospital')} 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Add New Hospital
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;