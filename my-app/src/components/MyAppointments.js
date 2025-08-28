import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Calendar, Clock, User, DollarSign, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is being used

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate(); // To handle navigation
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/appointments?username=${user?.name}`);
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.name) {
      fetchAppointments();
    } else {
      // Set a timeout to check if the user is not signed in
      const timeout = setTimeout(() => {
        setTimeoutReached(true);
        setLoading(false);
        alert('Please sign in first.');
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [user]);

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/appointments/${appointmentId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setAppointments(appointments.filter(app => app.appointment_id !== appointmentId));
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back to Home button */}
      <button
        onClick={() => navigate('/')} // Adjust the path as per your routing
        className="text-blue-600 hover:underline mb-4"
      >
        Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
      <div className="grid gap-6">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">{appointment.doctor_name}</h2>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                    <Clock className="h-4 w-4 ml-4" />
                    <span>{appointment.appointment_time}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      appointment.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                  <button
                    onClick={() => handleCancelAppointment(appointment.appointment_id)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!user && timeoutReached && (
          <div className="text-red-500 text-center mt-4">No appointments found. Please sign in.</div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
