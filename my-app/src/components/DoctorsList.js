import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import {  Clock,
  Heart, // Cardiologist
  Brain, // Neurologist
  User, // General physician
  Baby, // Pediatrician
  Stethoscope,
  Smile, // Dermatologist
  GraduationCap, // Education
 } from 'lucide-react';

import doc1 from '../assets/doc1.png';
import doc2 from '../assets/doc2.png';
import doc3 from '../assets/doc3.png';
import doc4 from '../assets/doc4.png';
import doc5 from '../assets/doc5.png';
import doc6 from '../assets/doc6.png';
import doc7 from '../assets/doc7.png';
import doc8 from '../assets/doc8.png';
import doc9 from '../assets/doc9.png';
import doc10 from '../assets/doc10.png';
import generalMedicineIcon from '../assets/physcian.png';
import gynecologyIcon from '../assets/gynac.png';
import pediatricsIcon from '../assets/pediatrics.png';
import neurologyIcon from '../assets/neuro.png';
import cardiologyIcon from '../assets/cardio.png';
import dermatologyIcon from '../assets/derma.png';
import orthopedicsIcon from '../assets/ortho.png';
import oncologyIcon from '../assets/onco.png';
import ophthalmologyIcon from '../assets/opthal.png';
import entIcon from '../assets/ENT.png';



const DoctorsList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  const specialties = [
    { name: 'General Medicine', icon: generalMedicineIcon },
    { name: 'Gynecology', icon: gynecologyIcon },
    { name: 'Pediatrics', icon: pediatricsIcon },
    { name: 'Neurology', icon: neurologyIcon },
    { name: 'Cardiology', icon: cardiologyIcon },
    { name: 'Dermatology', icon: dermatologyIcon },
    { name: 'Orthopedics', icon: orthopedicsIcon },
    { name: 'Oncology', icon: oncologyIcon },
    { name: 'Ophthalmology', icon: ophthalmologyIcon },
    { name: 'ENT', icon: entIcon },
  ];

 
// Create an image map
const doctorImages = {
  'doc1': doc1,
  'doc2': doc2,
  'doc3': doc3,
  'doc4': doc4,
  'doc5': doc5,
  'doc6': doc6,
  'doc7': doc7,
  'doc8': doc8,
  'doc9': doc9,
  'doc10': doc10
  
  
};

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/doctors');
        const data = await response.json();
        if (Array.isArray(data)) {
          // Convert BLOB to base64 URL for each doctor
          const doctorsWithImages = data.map(doctor => ({
            ...doctor,
            imageUrl: doctor.profile_photo ? `data:image/jpeg;base64,${arrayBufferToBase64(doctor.profile_photo.data)}` : null
          }));
          setDoctors(doctorsWithImages);
        } else {
          setDoctors([]);
          setError('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);


  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };


  const filteredDoctors = selectedSpecialty
    ? doctors.filter(doctor => doctor.Speciality === selectedSpecialty)
    : doctors;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!doctors.length) return <div>No doctors found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Doctors</h1>

      {/* Specialty Filter Section */}
      <div className="flex gap-4 mb-8 overflow-x-auto py-4">
        <div
          onClick={() => setSelectedSpecialty(null)}
          className={`flex flex-col items-center cursor-pointer ${
            !selectedSpecialty ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-2 hover:border-blue-600">
            <User className="w-8 h-8" />
          </div>
          <span className="text-sm">All</span>
        </div>
        
        {specialties.map((specialty) => {
          //const Icon = specialty.icon;
          return (
            <div
              key={specialty.name}
              onClick={() => setSelectedSpecialty(specialty.name)}
              className={`flex flex-col items-center cursor-pointer ${
                selectedSpecialty === specialty.name ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-2 hover:border-blue-600">
                <img src={specialty.icon} alt={specialty.name} className="w-11 h-11" />
              </div>
              <span className="text-sm whitespace-nowrap">{specialty.name}</span>
            </div>
          );
        })}
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredDoctors.map((doctor) => (
    <Card key={doctor.id} className="hover:shadow-lg transition-all">
      <CardContent className="p-6">
      {doctor.imageUrl ? (
                <img 
                  src={doctor.imageUrl}
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
      Book Appointment
         </button>
        
        
    
        
        
        
      </CardContent>
    </Card>
  ))}
</div>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    </div>
  );
};

export default DoctorsList;