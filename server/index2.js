const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// AWS RDS MySQL connection
const pool = mysql.createPool({
  host: 'hospitaldb.clu22e6ewt5r.eu-north-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Kshitu123',
  database: 'HOSPITAL',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to database successfully');
  connection.release();
});

// Get all doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM doc');
    res.json(rows);
    //console.log(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching doctors' });
  }
});

// Book appointment
app.post('/api/appointments', async (req, res) => {
  const { doctor_id, patient_name, appointment_date, appointment_time, status } = req.body;

  try {
    const [result] = await pool.promise().query(
      `INSERT INTO appointments (doctor_id, patient_name, patient_email,appointment_date, appointment_time, status,created_at) VALUES ( ?, ?, ?, ?,?,'scheduled', 'pending')`,
      [doctor_id, 'abc', 'kshitu', appointment_date, appointment_time]
    );
    res.json({ id: result.insertId, message: 'Appointment booked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error booking appointment' });
  }
});

// Add this new endpoint to handle appointment cancellation
app.delete('/api/appointments/:id', async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const [result] = await pool.promise().query(
      'DELETE FROM appointments WHERE appointment_id = ?',
      [appointmentId]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'Appointment cancelled successfully' });
    } else {
      res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Error cancelling appointment' });
  }
});

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(`
      SELECT 
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.payment_status,
        a.patient_name,
        d.Name1 as doctor_name,
        d.speciality
      FROM appointments a 
      JOIN doctors d ON a.doctor_id = d.id 
      ORDER BY a.appointment_date DESC, a.appointment_time DESC 

    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});


// Get doctor by ID
app.get('/api/doctors/:id', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM doc WHERE id = ?',
      [req.params.id]
    );
    console.log('Fetched doctor:', rows[0]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Doctor not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching doctor details' });
  }
});

// const fetchHospitals = async () => {
// try {
// const response = await axios.get('http://www.communitybenefitinsight.org/api/get_hospitals.php?state=AL', { // Replace with the actual API endpoint
// method : 'POST',
// 
// headers: {
// 'Content-Type': 'application/json',
// },
// });
//console.log('Hospital Details:', response.data); // Print the response data to the console
// } catch (error) {
// console.error('Error fetching hospital details:', error.message);
// }
// };
// 
// fetchHospitals();

// Remove the standalone fetchHospitals function and add this endpoint
app.get('/api/hospitals/:state', async (req, res) => {
  try {
    const stateCode = req.params.state;
    const response = await axios.get(
      `http://www.communitybenefitinsight.org/api/get_hospitals.php?state=${stateCode}`
    );
    res.json(response.data.slice(0, 9)); // Send only first 3 hospitals
  } catch (error) {
    console.error('Error fetching hospital details:', error);
    res.status(500).json({ error: 'Error fetching hospital details' });
  }
});


//checkout api
app.post('/api/create-checkout-session', async (req, res) => {
  const { products, appointment_date, appointment_time, patient_name } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ error: 'Products data is required.' });
  }

  try {
    const lineItems = products.map((product) => ({
      price_data: {
        currency: product.currency,
        product_data: {
          name: product.name,
          description: product.description,
        },
        unit_amount: product.amount, // Expect amount in the smallest currency unit (paise)
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
      metadata: {
        appointment_date,
        appointment_time,
        patient_name,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//get hospital when click on hospital name
// app.get('/api/hospital/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const hospital = await Hospital.findById(id);
//     if (!hospital) {
//       return res.status(404).json({ error: 'Hospital not found' });
//     }
//     res.json(hospital);
//   } catch (error) {
//     console.error('Error fetching hospital:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Fetch all hospitals for listing in cards
app.get('/api/hospitals', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM hospital_table');
    res.json(rows);
    // Uncomment below to debug and view the data in your terminal
    // console.log(rows);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ error: 'Error fetching hospitals' });
  }
});



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});