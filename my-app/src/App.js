//import MedicalTourismPlatform from './components/MedicalTourismPlatform';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MedicalTourismPlatform from './components/MedicalTourismPlatform';
import DoctorsList from './components/DoctorsList';
import BookAppointment from './components/BookAppointment';
import MyAppointments from './components/MyAppointments';
import HospitalsList from './components/HospitalsList';
import Success from './components/Success';
import Cancel from './components/Cancel';
import { AuthProvider } from './context/AuthContext';
import AdminHome from './components/AdminHome';
import AddHospital from './components/AddHospital';
import HospitalDetails from './components/HospitalDetails';
import HospitalDoctors from './components/HospitalDoctors';

import HospitalList1 from './components/HospitalList1';
import HospitalDetailsUser from './components/HospitalDetailsUser';
import HospitalDoctorsUser from './components/HospitalDoctorsUser';

import DoctorDashboard from './components/DoctorDashboard';

function App() {
  return (
    <AuthProvider>
    <Router>
    <Routes>
      <Route path="/" element={<MedicalTourismPlatform />} />
      <Route path="/doctors" element={<DoctorsList />} />
      <Route path="/book/:doctorId" element={<BookAppointment />} />
      <Route path="/my-appointments" element={<MyAppointments />} />
      {/* <Route path="/hospitals" element={<HospitalsList />} /> */}
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
      <Route path="/adminhome" element={<AdminHome />} /> 
      <Route path="/add-hospital" element={<AddHospital />} />
      <Route path="/hospital-details/:id" element={<HospitalDetails />} />
      <Route path="/hospital-doctors/:id" element={<HospitalDoctors />} />

      <Route path="/hospitals" element={<HospitalList1 />} />
      <Route path="/hospital-details-user/:id" element={<HospitalDetailsUser />} />
      <Route path="/hospital-doctors-user/:id" element={<HospitalDoctorsUser />} />

      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

      <Route path="/doctors" element={<DoctorsList />} />

    </Routes>
  </Router>
  </AuthProvider>
  );
}

export default App;