import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Search, Lock, MapPin, Calendar, Phone, Linkedin, Twitter, Instagram, Star, Heart, Activity, MessageCircle, X, Send, Plus, Stethoscope, FileText, Video, Clock, Camera, DollarSign, Globe, User, Settings, BedDouble, Clipboard } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/card';
import doctorPatientImage from '../assets/p.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import cardiology from '../assets/heartDoctor.png';
import orthopedic from '../assets/knee replacement.png';
import dental from '../assets/dental-inplant.png';
import doctorIcon from '../assets/doctor logo.png';
import patientIcon from '../assets/patient logo.png';
import DoctorForm from '../components/Doctorform.js';
import googleIcon from '../assets/googleIcon.png';
import { auth, signInWithGoogle } from '../firebase';
import { Mail } from 'lucide-react';

const MedicalTourismPlatform = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [registrationStage, setRegistrationStage] = useState('initial'); // 'initial', 'login', 'signup'

  const { isAuthenticated, user, login, logout } = useAuth();
  const procedureImages = {
    'Cardiac Surgery': cardiology,
    'Joint Replacement': orthopedic,
    'Dental Treatment': dental
  };

  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [user, setUser] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState({
    procedure: '',
    location: '',
    priceRange: '',
    rating: ''
  });

  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm MediBot, your AI healthcare assistant. How can I help you today?", isBot: true }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userType, setUserType] = useState(null);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: Date.now(), text: newMessage, isBot: false }]);
      setNewMessage('');
      try {
        const response = await axios.post('https://sahilbaviskar-aimedicalchatbot.hf.space/chat', { message: newMessage }); // Updated API 
        const aiResponse = response.data.response;
        setMessages((prev) => [...prev, { id: Date.now() + 1, text: aiResponse, isBot: true }]);
      } catch (error) {
        console.error('Error:', error);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: 'Sorry, something went wrong. Please try again.', isBot: true }
        ]);
      }
    }
  };

  const handleDoctorSubmit = async (doctorData) => {
    try {
      const response = await fetch('http://localhost:3001/auth/doctor-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });

      const data = await response.json();
      if (response.ok) {
        login(data.user);
        setShowAuthModal(false);
        alert('Doctor registration successful!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Doctor registration error:', error);
      alert('Registration failed');
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting auth with:', { ...authData, userType }); // Debug log
      const response = await fetch(`http://localhost:3001/auth/${isLogin ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...authData,
          userType
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (userType === 'doctor' && !isLogin) {
          // If doctor signup, show the registration form
          setRegistrationStage('signup');
        } else {
          login(data.user);
          if (userType === 'doctor') {
            navigate('/doctor-dashboard');
          }
          setShowAuthModal(false);
          alert(data.message);
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed');
    }
  };


  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result) {
        // User successfully signed in
        const userData = {
          name: result.user.displayName,
          email: result.user.email,
          userType: userType // Include the user type
        };

        // Send to backend with user type
        const response = await fetch('http://localhost:3001/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (response.ok) {
          login(data.user);
          if (userType === 'doctor') {
            navigate('/doctor-dashboard');
          }
          setShowAuthModal(false);
          alert('Successfully signed in with Google!');
        } else {
          // Show the actual error message from server
          alert(data.message);
        }
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Failed to sign in with Google. Please try again.');
    }
  };

  const procedures = [
    { id: 1, name: 'Cardiac Surgery', cost: '$15,000-$25,000', recovery: '4-6 weeks' },
    { id: 2, name: 'Joint Replacement', cost: '$12,000-$18,000', recovery: '2-3 months' },
    { id: 3, name: 'Dental Treatment', cost: '$3,000-$6,000', recovery: '3-6 months' }
  ];

  const hospitals = [
    {
      id: 1,
      name: 'Global Health Center',
      location: 'Bangkok, Thailand',
      specialties: ['Cardiology', 'Orthopedics'],
      rating: 4.9,
      accreditations: ['JCI', 'ISO'],
      facilities: ['ICU', 'Rehabilitation']
    },
    {
      id: 2,
      name: 'Advanced Medical Institute',
      location: 'Mumbai, India',
      specialties: ['Oncology', 'Neurology'],
      rating: 4.8,
      accreditations: ['NABH', 'JCI'],
      facilities: ['Robot Surgery', 'PET Scan']
    }
  ];


  const generateAIResponse = (query) => {
    const keywords = query.toLowerCase();
    if (keywords.includes('cost') || keywords.includes('price')) {
      return "Based on your location and treatment requirements, I recommend exploring options in Thailand. The average cost for this procedure ranges from $8,000-$15,000, including hospital stays.";
    }
    return "I can help you find suitable medical facilities and arrange consultations. Could you specify your preferred treatment type?";
  };

  const Features = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[
        { icon: <Stethoscope />, title: 'Find Your Specialist', desc: 'Filter doctors by specialty meet your needs' },
        { icon: <FileText />, title: 'Smart Appointments', desc: 'Book doctors by specialty, date, and slot with easy payments.' },
        { icon: <BedDouble />, title: 'Hospital Insights', desc: 'View hospital details, doctors, and available treatments' },
        { icon: <Clipboard />, title: 'Personalized Care', desc: 'Receive AI-driven health recommendations tailored to you' },
        { icon: <Activity />, title: 'Treatment Explorer', desc: 'Discover treatment options with intuitive, detailed cards' },
        { icon: <MessageCircle />, title: 'Medicare chatbot', desc: 'Get instant answers with our AI-powered chatbot' }
      ].map((feature, index) => (
        <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              {feature.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          </CardContent>
        </Card>
      ))}


    </div>
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="px-8">
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              HealthJourney Global
            </h1>
          </div>


          <button
            onClick={() => navigate('/my-appointments')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            <Calendar className="h-5 w-5" />
            My Appointments
          </button>


          {isAuthenticated && user ? (
            <div className="relative menu-container">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                <User className="h-5 w-5 text-blue-600" />
                <span className="text-gray-600">Welcome, {user.name}</span>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl border">
                  <button
                    onClick={() => {
                      logout();
                      setShowAuthModal(false);
                      setIsMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              <User className="h-5 w-5" />
              Sign In
            </button>
          )}

          <button
            onClick={() => navigate('/hospitals')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Book Consultation
          </button>

          <button
            onClick={() => navigate('/adminhome')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Lock className="h-5 w-5" />
            Admin
          </button>
        </div>
      </div>



      {/* Hero Section */}
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-2xl mb-8 mt-9 overflow-hidden mt-[100px]">
        {/* Left side with text */}
        <div className="absolute left-0 inset-y-0 w-3/5 bg-blue-600 z-10">
          <div className="p-8 h-full flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Find Your Path to Better Health
            </h2>
            <p className="text-xl mb-6 text-white">
              Access Premium Healthcare Worldwide
            </p>
          </div>
        </div>


        <div
          className="absolute inset-0 z-0"
          style={{
            clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 50% 100%)',
            background: 'linear-gradient(rgba(37, 99, 235, 0.8), rgba(37, 99, 235, 0.6))'
          }}
        >
          <img
            src={doctorPatientImage}
            alt="Doctor with Patient"
            className="w-full h-[-150%] object-cover"
          />
        </div>
      </div>




























      {/* AI Recommendation */}
      <Alert className="mb-8 bg-green-50 border-green-200">
        <Activity className="h-4 w-4" />
        <AlertTitle>Here's your personalized health Insight</AlertTitle>
        <AlertDescription>
          Based on your profile and current health needs, we recommend exploring cardiac treatments
          in Thailand during October-November for optimal weather and pricing.
        </AlertDescription>
      </Alert>

      {/* Features Grid */}
      <Features />

      {/* Procedures Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Popular Medical Procedures</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {procedures.map(proc => (
            <Card key={proc.id} className="hover:shadow-lg transition-all">
              <img
                src={procedureImages[proc.name]}
                alt={proc.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">{proc.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{proc.cost}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Recovery: {proc.recovery}</span>
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Learn More
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Hospitals Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Hospitals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hospitals.map(hospital => (
            <Card key={hospital.id} className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg">{hospital.name}</h3>
                  <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer" />
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{hospital.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>{hospital.rating}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {hospital.specialties.map(spec => (
                    <span key={spec} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {hospital.accreditations.map(acc => (
                    <span key={acc} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      {acc}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>


      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate('/doctors')}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Stethoscope className="h-5 w-5" />
          View All Doctors
        </button>
      </div>


      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg p-8 max-w-md w-full  max-h-[90vh] overflow-y-auto">

              <div className="flex justify-between items-center mb-6 top-0 bg-white pb-4">
                <h2 className="text-2xl font-bold text-center flex-grow">
                  {userType === 'doctor' ? (
                    registrationStage === 'login' ? 'Sign In' : 'Sign Up'
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </h2>
                <button
                  onClick={() => {
                    setShowAuthModal(false);
                    setUserType(null);
                    setRegistrationStage('initial');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* User Type Selection */}
              {!userType ? (
                <div className="mb-6">
                  <h3 className="text-center text-lg font-medium mb-4">Select User Type</h3>
                  <div className="flex justify-center gap-8">
                    <div
                      onClick={() => {
                        setUserType('doctor');
                        setRegistrationStage('login');
                      }}
                      className="flex flex-col items-center gap-2 cursor-pointer p-4 rounded-lg hover:bg-blue-50 transition-colors"
                    >

                      <img
                        src={doctorIcon}
                        alt="Doctor"
                        className="w-24 h-24 object-cover rounded-full border-2"
                      />

                      <span className="font-medium">Doctor</span>
                    </div>
                    <div
                      onClick={() => setUserType('patient')}
                      className="flex flex-col items-center gap-2 cursor-pointer p-4 rounded-lg hover:bg-blue-50 transition-colors"
                    >

                      <img
                        src={patientIcon}
                        alt="Patient"
                        className="w-24 h-24 object-cover rounded-full border-2 border-black-600"
                      />

                      <span className="font-medium">Patient</span>
                    </div>
                  </div>
                </div>
              ) : (
                userType === 'doctor' ? (
                  registrationStage === 'login' ? (
                    // Doctor Login Form
                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={authData.email}
                            onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                            className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
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
                            value={authData.password}
                            onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                            className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                      >
                        Sign
                      </button>
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
                      >
                        <img
                          src={googleIcon}
                          alt="Google"
                          className="w-5 h-5"
                        />
                        Continue with Google
                      </button>

                      <p className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setRegistrationStage('signup')}
                          className="text-blue-600 hover:underline"
                        >
                          Sign Up
                        </button>
                      </p>
                    </form>



                  ) : (
                    <DoctorForm onSubmit={handleDoctorSubmit} />
                  )
                ) : (
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={authData.name}
                          onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={authData.email}
                          onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                          className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
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
                          value={authData.password}
                          onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                          className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      {isLogin ? 'Sign In' : 'Create Account'}
                    </button>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
                    >
                      <User className="h-5 w-5" />
                      Continue with Google
                    </button>

                    <p className="text-center text-sm text-gray-600">
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-600 hover:underline"
                      >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                      </button>
                    </p>
                  </form>
                ))}
            </div>
          </div>
        </div>

      )}



      {/* Chatbot */}
      <div>
        {/* Chat Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:-translate-y-1"
        >
          {isChatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
        {/* Chat Window */}
        {isChatOpen && (
          <div className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl border">
            {/* Chat Header */}
            <div className="bg-blue-600 p-4 rounded-t-xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-white font-bold">MediBot Assistant</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Chat Body */}
            <div className="h-96 overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-4 flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${msg.isBot ? 'bg-white' : 'bg-blue-600 text-white'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            {/* Chat Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about treatments, costs, or facilities..."
                  className="flex-1 p-2 border rounded-lg"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="bg-blue-600 text-white mt-16 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div>
                <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <a href="mailto:info@medicaltourism.com">info@medicaltourism.com</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <a href="#" className="hover:text-blue-200"><Linkedin className="h-6 w-6" /></a>
                    <a href="#" className="hover:text-blue-200"><Twitter className="h-6 w-6" /></a>
                    <a href="#" className="hover:text-blue-200"><Instagram className="h-6 w-6" /></a>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-xl font-bold mb-4">Our Location</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 mt-1" />
                  <div>
                    <p>123 Healthcare Avenue</p>
                    <p>Medical District</p>
                    <p>New York, NY 10001</p>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-xl font-bold mb-4">Our Services</h3>
                <ul className="space-y-2">
                  <li>Medical Tourism Packages</li>
                  <li>International Patient Care</li>
                  <li>Hospital Networks</li>
                  <li>Treatment Planning</li>
                  <li>Travel Assistance</li>
                  <li>Post-treatment Support</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-blue-400 mt-8 pt-8 text-center">
              <p>&copy; 2024 Medical Tourism Platform. All rights reserved.</p>
            </div>
          </div>
        </footer>

      </div>

    </div>

  );
};
export default MedicalTourismPlatform;