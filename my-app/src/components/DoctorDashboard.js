import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { 
  User, 
  Calendar, 
  Clock, 
  GraduationCap, 
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'appointments'

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        // Fetch doctor profile
        const profileResponse = await fetch(`http://localhost:3001/api/doctor-profile/${user.email}`);
        if (!profileResponse.ok) throw new Error('Failed to fetch profile');
        const profileData = await profileResponse.json();
        setDoctorProfile(profileData);

        // Fetch doctor appointments
        const appointmentsResponse = await fetch(`http://localhost:3001/api/doctor-appointments/${profileData.id}`);
        if (!appointmentsResponse.ok) throw new Error('Failed to fetch appointments');
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchDoctorData();
    }
  }, [user]);

  const arrayBufferToBase64 = (buffer) => {
    if (!buffer) return '';
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const handleAppointmentComplete = async (appointmentId) => {
    if (window.confirm('Mark this appointment as completed?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/appointments/${appointmentId}/complete`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (response.ok) {
          // Update appointment status in local state
          setAppointments(appointments.map(appointment => 
            appointment.appointment_id === appointmentId 
              ? { ...appointment, status: 'completed' }
              : appointment
          ));
          alert('Appointment marked as completed');
        } else {
          alert('Failed to update appointment status');
        }
      } catch (error) {
        console.error('Error updating appointment:', error);
        alert('Error updating appointment status');
      }
    }
  };
  
  const handleAppointmentCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/appointments/${appointmentId}`, {
          method: 'DELETE'
        });
  
        if (response.ok) {
          // Remove the cancelled appointment from local state
          setAppointments(appointments.filter(appointment => 
            appointment.appointment_id !== appointmentId
          ));
          alert('Appointment cancelled successfully');
        } else {
          alert('Failed to cancel appointment');
        }
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Error cancelling appointment');
      }
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <button
          onClick={() => {
            // Implement logout
            navigate('/');
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'profile' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'appointments' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Appointments
        </button>
      </div>

      {/* Content */}
      {activeTab === 'profile' ? (
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Photo */}
              <div>
                {doctorProfile?.profile_photo ? (
                  <img
                    src={`data:image/jpeg;base64,${arrayBufferToBase64(doctorProfile.profile_photo.data)}`}
                    alt={doctorProfile.name1}
                    className="w-full h-70 object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <User className="h-20 w-20 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{doctorProfile?.name1}</h2>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-gray-500" />
                  <span>{doctorProfile?.Speciality}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{doctorProfile?.hospital_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-gray-500" />
                  <span>{doctorProfile?.experience_years} Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span>{doctorProfile?.phone_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span>{doctorProfile?.email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {appointments.map((appointment) => (
            <Card key={appointment.appointment_id} className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-2">{appointment.patient_name}</h2>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                      <Clock className="h-4 w-4 ml-4" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      appointment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAppointmentComplete(appointment.appointment_id)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark as Complete
                  </button>
                  <button
                    onClick={() => handleAppointmentCancel(appointment.appointment_id)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;