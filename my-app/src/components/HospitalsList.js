import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from './ui/card';
import { MapPin, Bed, Baby,phone } from 'lucide-react';

const HospitalsList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('AL');
  const [error, setError] = useState(null);

  // List of US states
  const states = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
  ];

  useEffect(() => {
    fetchHospitals(selectedState);
  }, [selectedState]);

  const fetchHospitals = async (stateCode) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/hospitals/${stateCode}`
      );
      // Take first 3 hospitals from the response
      console.log(response.data.slice(0, 3));
      setHospitals(response.data.slice(0, 9));
      
      setError(null);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setError('Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-6">Loading hospitals...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hospitals</h1>
        <div className="flex items-center gap-4">
          <label htmlFor="state" className="font-medium">Select State:</label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {states.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {hospitals.map((hospital) => (
    <Card 
      key={hospital.medicare_provider_number} 
      className="group hover:shadow-xl transition-all duration-300 border-t-4 border-transparent hover:border-blue-600"
    >
     <CardContent className="p-6">
  <div className="space-y-2">
    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
      {hospital.name}
    </h2>
    <div className="flex items-center gap-2">
      <Bed className="h-4 w-4 text-blue-600" />
      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
        {hospital.hospital_bed_size} Size
      </span>
    </div>
  </div> 
      
     <div className="space-y-4 mt-6">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
            <MapPin className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <p className="font-medium">{hospital.street_address}</p>
              <p className="text-gray-600">{hospital.city}, {hospital.state}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
            <Bed className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Bed Capacity</p>
              <p className="text-gray-600">{hospital.hospital_bed_count} beds</p>
            </div>
          </div>

          {hospital.children_hospital_f === 'Y' && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <baby className="h-5 w-5 text-blue-600" />
              <p className="font-medium text-blue-800">Children's Hospital</p>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
            <phone className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Medicare Provider</p>
              <p className="text-gray-600">#{hospital.medicare_provider_number}</p>
            </div>
          </div>
        </div>

        
        
        
      </CardContent>
    </Card>
  ))}
</div>
</div>
  );
};

export default HospitalsList;