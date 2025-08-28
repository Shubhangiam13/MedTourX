const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const multer = require('multer');
const upload = multer();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});



// Add cors middleware with options
app.use(cors({
  origin: 'http://localhost:3002',
  credentials: true
}));

// Add authentication middleware
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Use authentication middleware for protected routes
app.use('/api/protected', authenticate);

// Add validation middleware
const validate = (req, res, next) => {
  const { error } = validateInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};


// Use validation middleware for routes that require validation
app.use('/api/validation', validate);










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
  

  //app.use(cors({
  //  origin: 'http://localhost:3002', // Your React app port
  //  credentials: true
  //}));

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

const authenticateUser = async (req, res, next) => {
  const { email } = req.body;
  try {
    const [users] = await pool.promise().query(
      'SELECT * FROM login WHERE email = ?',
      [email]
    );
    if (users.length > 0) {
      req.user = users[0];
      next();
    } else {
      res.status(401).json({ error: 'User not authenticated' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};
// Book appointment
app.post('/api/appointments', async (req, res) => {
  const { doctor_id, appointment_date, appointment_time, patient_name, patient_email } = req.body;
  
  try {
    const [result] = await pool.promise().query(
      `INSERT INTO appointments (
        doctor_id, 
        patient_name, 
        patient_email, 
        appointment_date, 
        appointment_time, 
        status, 
        payment_status
      ) VALUES (?, ?, ?, ?, ?, 'scheduled', 'pending')`,
      [
        doctor_id,
        patient_name,  // This will come from authenticated user
        patient_email, // This will come from authenticated user
        appointment_date,
        appointment_time
      ]
    );
    res.json({ 
      id: result.insertId, 
      message: 'Appointment booked successfully'
    });
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

// Mark appointment as complete
app.put('/api/appointments/:id/complete', async (req, res) => {
  try {
    const [result] = await pool.promise().query(
      'UPDATE appointments SET status = ? WHERE appointment_id = ?',
      ['completed', req.params.id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Appointment marked as completed' });
    } else {
      res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Error updating appointment' });
  }
});

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  const { username } = req.query;
  try {
    const [rows] = await pool.promise().query(`
      SELECT 
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.payment_status,
        a.patient_name,
        d.name1 as doctor_name,
        d.Speciality
      FROM appointments a 
      JOIN doc d ON a.doctor_id = d.id 
      WHERE a.patient_name = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC 

    `,[username]);
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

// Get hospital details by ID
app.get('/api/hospitals1/:id', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM hospital_table WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length > 0) {
      const hospital = rows[0];
      
      // Convert image data for proper display
      if (hospital.image) {
        // Handle multiple images if stored as array or concatenated blobs
        const images = hospital.image;
        hospital.imageData = images.toString('base64');
      }
     res.json(hospital);
    } 
    else {
      res.status(404).json({ error: 'Hospital not found' });
    }
  } catch (error) {
    console.error('Error fetching hospital details:', error);
    res.status(500).json({ error: 'Error fetching hospital details' });
  }
});

app.get('/api/hospitals1', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM hospital_table');
    
    // Convert BLOB images to base64
    const hospitalsWithImages = rows.map(hospital => {
      if (hospital.image) {
        // Use the same conversion logic as single hospital endpoint
        const images = hospital.image;
        hospital.imageData = images.toString('base64');
      }
      return hospital;
    });

    res.json(hospitalsWithImages);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ error: 'Error fetching hospitals' });
  }
});
// Delete hospital by ID
app.delete('/api/hospitals1/:id', async (req, res) => {
  try {
    const [result] = await pool.promise().query(
      'DELETE FROM hospital_table WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Hospital deleted successfully' });
    } else {
      res.status(404).json({ error: 'Hospital not found' });
    }
  } catch (error) {
    console.error('Error deleting hospital:', error);
    res.status(500).json({ error: 'Error deleting hospital' });
  }
});

// Get doctors by hospital name
app.get('/api/hospital-doctors/:hospitalName', async (req, res) => {
  try {
    const hospitalName = decodeURIComponent(req.params.hospitalName);
    console.log(hospitalName);
    console.log('Fetching doctors for hospital:', hospitalName); // Debug log
    const [rows] = await pool.promise().query(
      'SELECT * FROM doc WHERE hospital_name = ?',
      [hospitalName]
    );
    console.log('Found doctors:', rows); // Debug log
    res.json(rows);
  } catch (error) {
    console.error('Error fetching hospital doctors:', error);
    res.status(500).json({ error: 'Error fetching hospital doctors' });
  }
});

app.post('/api/hospitals', upload.array('images'), async (req, res) => {
  try {
    const { hospital_name, address, speciality, description } = req.body;
    const images = req.files ? req.files[0].buffer : null; // Get first image for now

    // Validate required fields
    if (!hospital_name || !address || !speciality) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Insert hospital data
    const [result] = await pool.promise().query(
      `INSERT INTO hospital_table (
        hospital_name,
        address,
        speciality,
        description,
        image
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        hospital_name,
        address,
        speciality,
        description,
        images
      ]
    );

    res.status(201).json({
      message: 'Hospital added successfully',
      hospitalId: result.insertId
    });

  } catch (error) {
    console.error('Error adding hospital:', error);
    res.status(500).json({ message: 'Error adding hospital' });
  }
});



// Sign Up Route
app.post('/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await pool.promise().query(
      'SELECT * FROM login WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Insert new user
    const [result] = await pool.promise().query(
      'INSERT INTO login (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Database error during signup' });
  }
});

// Login Route
// Login Route
app.post('/auth/login', async (req, res) => {
  const { email, password, userType } = req.body; // Add userType to destructuring

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if logging in as doctor
    if (userType === 'doctor') {
      const [doctors] = await pool.promise().query(
        'SELECT * FROM doc WHERE email = ? AND password = ?',
        [email, password]
      );

      if (doctors.length > 0) {
        res.json({ 
          message: 'Login successful',
          user: {
            id: doctors[0].id,
            name: doctors[0].name1,
            email: doctors[0].email,
            userType: 'doctor'
          }
        });
      } else {
        res.status(401).json({ message: 'Invalid doctor credentials' });
      }
    } else {
      // Patient login logic
      const [users] = await pool.promise().query(
        'SELECT * FROM login WHERE email = ? AND password = ?',
        [email, password]
      );

      if (users.length > 0) {
        res.json({ 
          message: 'Login successful',
          user: {
            id: users[0].id,
            name: users[0].name,
            email: users[0].email,
            userType: 'patient'
          }
        });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Database error during login' });
  }
});


// Get doctor profile
app.get('/api/doctor-profile/:email', async (req, res) => {
  try {
    console.log('Fetching doctor profile:', req.params.email);
    const [rows] = await pool.promise().query(
      'SELECT * FROM doc WHERE email = ?',
      [req.params.email]
    );
    
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Doctor not found' });
    }
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    res.status(500).json({ error: 'Error fetching doctor profile' });
  }
});

// Get doctor appointments
app.get('/api/doctor-appointments/:doctorId', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(
      `SELECT 
        a.*
      FROM appointments a
      WHERE a.doctor_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [req.params.doctorId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

app.post('/auth/google', async (req, res) => {
  const { name, email, userType } = req.body;

  try {
    let table = userType === 'doctor' ? 'doc' : 'login';
    
    // Check if user exists
    const [existingUsers] = await pool.promise().query(
      `SELECT * FROM ${table} WHERE email = ?`,
      [email]
    );

    if (existingUsers.length === 0) {
      // Create new user with appropriate table
      if (userType === 'doctor') {
        const [existingDoctors] = await pool.promise().query(
          'SELECT * FROM doc WHERE email = ?',
          [email]
        );
  
        if (existingDoctors.length > 0) {
          return res.status(200).json({
            message: 'Doctor account exists',
            user: {
              name: existingDoctors[0].name1,
              email: existingDoctors[0].email,
              userType: 'doctor'
            }
          });
        } else {
          return res.status(400).json({ 
            message: 'Please sign up first as a doctor'
          });
        }
      
      
      
    } else {
        await pool.promise().query(
          'INSERT INTO login (name, email, auth_provider) VALUES (?, ?, "google")',
          [name, email]
        );
      }
    }

    res.json({ 
      message: 'Google sign in successful',
      user: {
        name,
        email,
        userType
      }
    });
  } catch (error) {
    console.error('Error during Google sign in:', error);
    res.status(500).json({ message: 'Database error during Google sign in' });
  }
});

/*app.post('/api/create-checkout-session', async (req, res) => {
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
      success_url: 'http://localhost:3002/success',
      cancel_url: 'http://localhost:3002/cancel',
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
});*/

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items, email, bookingId } = req.body;

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          description: item.description || 'Medical Consultation'
        },
        unit_amount: item.price_data.unit_amount,
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3002/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3002/cancel',
      customer_email: email,
      metadata: {
        bookingId: bookingId.toString(),
        customerEmail: email
      },
      payment_intent_data: {
        metadata: {
          bookingId: bookingId.toString()
        }
      }
    });

    res.json({ 
      url: session.url,
      sessionId: session.id 
    });

  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.stack 
    });
  }
});

// Doctor registration endpoint
app.post('/api/doctor-signup', upload.single('profile_photo'),async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    gender,
    speciality,
    successStory,
    certificates,
    hospital,
    experience

  } = req.body;

  // Log the received data for debugging
  console.log('Received data:', {
    name,
    email,
    password,
    phone,
    gender,
    speciality,
    hospital,
    experience
  });
  if (!name || !email || !password || !phone || !gender || !speciality || !hospital) {
    return res.status(400).json({ 
      message: 'Missing required fields',
      receivedData: req.body 
    });
  }

 
  try {
    // Check if doctor already exists
    const [existingDoctors] = await pool.promise().query(
      'SELECT * FROM doc WHERE email = ?',
      [email]
    );

    if (existingDoctors.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const profile_photo = req.file ? req.file.buffer : null;

    // Insert doctor data
    const [result] = await pool.promise().query(
      `INSERT INTO doc (
        name1, 
        email, 
        password, 
        phone_number, 
        gender, 
       Speciality, 
        success_story,
        certificates,
        hospital_name,
        profile_photo,
        experience_years
      ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [
        name,
        email,
        password,
        phone,
        gender,
        speciality,
        successStory|| '',
        certificates ? JSON.stringify(certificates) : '[]',
        hospital,
        profile_photo,
        experience || '0'
       // Store certificates as JSON
      ]
    );

    // Also create login entry for the doctor
    // await pool.promise().query(
      // 'INSERT INTO login (name, email, password, user_type) VALUES (?, ?, ?, ?)',
      // [name, email, password, 'doctor']
    // );

    res.status(201).json({
      message: 'Doctor registered successfully',
      doctorId: result.insertId
    });

  } catch (error) {
    console.error('Error during doctor registration:', error);
    res.status(500).json({ message: 'Database error during registration' });
  }
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});