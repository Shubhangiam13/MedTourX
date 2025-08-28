import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { Hospital } from 'lucide-react';

const HospitalList1 = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/hospitals1');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const arrayBufferToBase64 = (buffer) => {
    if (!buffer) return '';
    try {
      const binary = Array.from(new Uint8Array(buffer))
        .map((b) => String.fromCharCode(b))
        .join('');
      return btoa(binary);
    } catch (error) {
      console.error('Error converting image:', error);
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back to Home Button and Centered Title */}
        <div className="relative mb-8">
          {/* Back to Home Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute left-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
          {/* Centered Title */}
          <h1 className="text-4xl font-bold text-blue-600 text-center">All Available Hospitals</h1>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center">Loading hospitals...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <Card key={hospital.id} className="hover:shadow-lg transition-all flex flex-col justify-between h-full relative overflow-hidden">
                <div className="w-full h-60">
                  {hospital.imageData ? (
                    <img
                      src={`data:image/jpeg;base64,${hospital.imageData}`}
                      alt={hospital.hospital_name}
                      className="w-full h-full object-cover object-top"
                      style={{
                        backgroundColor: 'rgb(249, 250, 251)',
                      }}
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
                      onClick={() => navigate(`/hospital-details-user/${hospital.id}`)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigate(`/hospital-doctors-user/${hospital.id}`)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      View Doctors
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalList1;
