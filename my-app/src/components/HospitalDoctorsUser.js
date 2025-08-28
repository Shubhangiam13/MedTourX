import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import {
  User,
  GraduationCap,
  Stethoscope,
  ArrowLeft,
} from 'lucide-react';

const HospitalDoctorsUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingTimeout(true);
    }, 7000);

    const fetchHospitalAndDoctors = async () => {
      try {
        // Fetch hospital details
        const hospitalResponse = await fetch(`http://localhost:3001/api/hospitals1/${id}`);
        if (!hospitalResponse.ok) throw new Error('Hospital not found');
        const hospitalData = await hospitalResponse.json();
        setHospital(hospitalData);

        // Fetch doctors for this hospital
        const doctorsResponse = await fetch(
          `http://localhost:3001/api/hospital-doctors/${hospitalData.hospital_name}`
        );
        if (!doctorsResponse.ok) throw new Error('Failed to fetch doctors');
        const doctorsData = await doctorsResponse.json();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    fetchHospitalAndDoctors();

    return () => clearTimeout(timeout);
  }, [id]);

  const arrayBufferToBase64 = (buffer) => {
    if (!buffer) return '';
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Get unique specialties from doctors
  const specialties = [...new Set(doctors.map((doctor) => doctor.Speciality))];

  // Filter doctors by specialty
  const filteredDoctors =
    selectedSpecialty && selectedSpecialty !== 'All'
      ? doctors.filter((doctor) => doctor.Speciality === selectedSpecialty)
      : doctors;

  if (loading) {
    return (
      <div className="text-center p-6">
        
        {loadingTimeout ? (
          <div className="text-red-600">No doctors found.</div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <button
          onClick={() => navigate('/hospitals')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Hospitals
        </button>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={() => navigate('/hospitals')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Hospitals
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{hospital?.hospital_name}</h1>
        <p className="text-gray-600">Doctors List</p>
      </div>

      {/* Specialty Filter */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Filter by Specialty</h2>
        <div className="flex gap-4 overflow-x-auto py-2">
          <button
            onClick={() => setSelectedSpecialty('All')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !selectedSpecialty || selectedSpecialty === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            All Specialties
          </button>
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedSpecialty === specialty
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              {doctor.profile_photo ? (
                <img
                  src={`data:image/jpeg;base64,${arrayBufferToBase64(
                    doctor.profile_photo.data
                  )}`}
                  alt={doctor.name1}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <User className="h-20 w-20 text-gray-400" />
                </div>
              )}

              <h2 className="text-xl font-bold mb-2">{doctor.name1}</h2>
              <p className="text-gray-600 mb-2">{doctor.Speciality}</p>

              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <GraduationCap className="h-4 w-4" />
                <span>Experience: {doctor.experience_years} years</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Stethoscope className="h-4 w-4" />
                <span>{doctor.hospital_name}</span>
              </div>

              <button
                onClick={() => navigate(`/book/${doctor.id}`)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4"
              >
                View Details
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HospitalDoctorsUser;
