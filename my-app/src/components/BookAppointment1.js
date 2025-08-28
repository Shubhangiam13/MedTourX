import React, { useState, useEffect } from 'react';
import {loadStripe} from '@stripe/stripe-js';

import { useParams } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { User,Calendar, Clock, Award, Book, GraduationCap, Stethoscope } from 'lucide-react';
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
import { useAuth } from '../context/AuthContext';


const BookAppointment = () => {
  const { user } = useAuth();
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots] = useState(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState(null);
const [showPayment, setShowPayment] = useState(false);
const [bookingId, setBookingId] = useState(null);
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
    const fetchDoctorDetails = async () => {
      try {
        console.log('Fetching doctor with ID:', doctorId); // Debug log
        const response = await fetch(`http://localhost:3001/api/doctors/${doctorId}`);
        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
        fetchDoctorDetails();
      }
    }, [doctorId]);

    if (loading) return <div className="text-center p-6">Loading doctor details...</div>;
  
  

  const getNext7Days = () => {
    const days = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date: date,
        dayName: daysOfWeek[date.getDay()],
        dayNumber: date.getDate()
      });
    }
    return days;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctor_id: doctorId,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          patient_email: user.email,
          patient_name: user.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
      setBookingId(data.id);
      return data.id;
      } else {
        alert('Failed to book appointment');
        return null;
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      alert('Error booking appointment');
      return null;
    }
  };


  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleBookingAndPayment = async () => {
    const bookingResult = await handleBooking();
    if (bookingResult) {
      await makePayment();
    }
  };
  
  if (loading || !doctor) return <div>Loading...</div>;
  const makePayment = async () => {
    const stripe = await loadStripe('pk_test_51PuIv9Rt4bZZiTQmbMvH1ZRG2w26Pl6vhQfqxjTuX1DsDfM190vQVOW19uxP474IhAkuGeSZt5PVOZM3ui1ZbK0G002M2Bu3bm');
    const fees = Math.round(parseFloat(doctor?.Consultation_Fee) * 100);
    const body = {
      products: [
        {
          name: doctor.Name1, // Doctor's name
          description: doctor.speciality, // Doctor's specialty
          amount: fees, // Convert fees from rupees to paise
          currency: 'inr', // Currency for the payment (Indian Rupees)
        },
      ],
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      patient_name: "Test Patient", // You can collect this via a form if needed
    };
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    try {
      const response = await fetch('http://localhost:3001/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              price_data: {
                currency: 'inr',
                product_data: {
                  name: `Consultation with Dr. ${doctor?.name1}`,
                  description: `Appointment on ${selectedDate} at ${selectedTime}`
                },
                unit_amount: fees,
              },
              quantity: 1
            }
          ],
          email: user.email,
          bookingId
        }),
      });
    
      if (response.ok) {
        const session = await response.json();
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });
    
        if (result.error) {
          alert(result.error.message);
        }
      } else {
        const errorData = await response.json();
        alert(`Error initiating payment: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error during payment:', error);
      alert('Payment failed');
    }
  };
    


  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Doctor's Photo */}
        <div>
        {doctor?.profile_photo ? (
          <img
            src={`data:image/jpeg;base64,${arrayBufferToBase64(doctor.profile_photo.data)}`}
            alt={doctor.name1}
            className="w-full rounded-lg shadow-lg h-30 object-cover"
          />
        ) : (
          <div className="w-full h-30 bg-gray-200 rounded-lg flex items-center justify-center">
            <User className="h-20 w-20 text-gray-400" />
          </div>
        )}
      </div>

        {/* Right Column - Doctor's Details */}
        <Card className="h-fit">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-4">{doctor?.name1}</h1>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Stethoscope className="h-5 w-5" />
                <span>{doctor?.Speciality}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="h-5 w-5" />
                <span>{doctor?.experience_years} Years</span>
              </div>
              {/* <div className="flex items-center gap-2 text-gray-600"> */}
                {/* <Award className="h-5 w-5" /> */}
                {/* <span>{doctor.experience} years experience</span> */}
              {/* </div> */}
              <div className="flex items-center gap-2 text-gray-600">
                <Book className="h-5 w-5" />
                <span>${doctor?.Consultation_Fee} Consultation Fee</span>
              </div>
              <div className="mt-4">
                <h3 className="font-bold mb-2">Contact number</h3>
                <p className="text-gray-600">{doctor?.phone_number}</p>
              </div>
              <div className="mt-4">
              <h3 className="font-bold mb-2">Email</h3>
               <p className="text-gray-600">{doctor?.email}</p>
                  </div>
              <div className="mt-4">
              <h3 className="font-bold mb-2">Speciality</h3>
              <p className="text-gray-600">{doctor?.success_story}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Select Appointment Date</h2>
        
        {/* Date Selection */}
        <div className="flex gap-4 mb-8 overflow-x-auto py-2">
          {getNext7Days().map((day) => (
            <div
              key={day.date.toISOString()}
              onClick={() => setSelectedDate(day.date.toISOString())}
              className={`flex flex-col items-center p-4 rounded-lg cursor-pointer border-2 min-w-[100px]
                ${selectedDate === day.date.toISOString() 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-600 hover:bg-blue-50'}`}
            >
              <span className="text-sm text-gray-600">{day.dayName}</span>
              <span className="text-xl font-bold">{day.dayNumber}</span>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <>
            <h3 className="text-xl font-bold mb-4">Available Time Slots</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 text-center rounded-lg border-2 
                    ${selectedTime === time 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-600 hover:bg-blue-50'}`}
                >
            
                  {time}
                </button>
              ))}
            </div>
          </>
        )}

{!showPayment ? (
  <button
    onClick={handleBookingAndPayment}
    className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
  >
    Book Appointment
  </button>
) 
: (
  <button
    className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
    onClick={makePayment}
  >
    Make Payment
  </button>
)}

        
        
        

        
        
        
      </div>
    </div>
  );
};

export default BookAppointment;