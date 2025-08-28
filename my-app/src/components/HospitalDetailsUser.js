import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Hospital, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';

const HospitalDetailsUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/hospitals1/${id}`);
        if (!response.ok) {
          throw new Error('Hospital not found');
        }
        const data = await response.json();
        setHospital(data);
      } catch (error) {
        console.error('Error fetching hospital details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalDetails();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;
  if (!hospital) return <div className="text-center p-6">Hospital not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={() => navigate('/hospitals')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Hospitals
      </button>

      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{hospital.hospital_name}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{hospital.address}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hospital Image - Now First */}
            <div>
              <h2 className="text-xl font-bold mb-4">Hospital Image</h2>
              {hospital.imageData ? (
                <img
                  src={`data:image/jpeg;base64,${hospital.imageData}`}
                  alt={hospital.hospital_name}
                  className="w-full rounded-lg shadow-lg mb-4"
                  style={{
                    maxHeight: '400px',
                    width: '100%',
                    objectFit: 'contain',
                    backgroundColor: 'rgb(249, 250, 251)',
                  }}
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Hospital className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4">Hospital Information</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Speciality</h3>
                    <p className="text-gray-600">{hospital.speciality}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-gray-600">{hospital.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalDetailsUser;
