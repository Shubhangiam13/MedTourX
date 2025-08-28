import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase.js'; // Import Firestore instance
import { setDoc, doc } from 'firebase/firestore'; // Firestore functions
import './LoginSignup.css';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

// Import the SigninWithGoogle component
import SigninWithGoogle from './SigninWithGoogle';

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    const { name, email, password } = formData;

    try {
      if (action === "Sign Up") {
        console.log("Attempting to sign up:", { email, password });
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "Users", user.uid), {
          name: name,
          email: user.email,
          uid: user.uid,
          createdAt: new Date()
        });
        console.log("User data saved in Firebase:", {
          name: name,
          email: user.email,
          uid: user.uid,
        });
        console.log("Registration successful!");
        alert("Registration successful!");
      } else {
        console.log("Attempting to log in:", { email, password });
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful:", userCredential);
        alert("Login successful!");
      }
    } catch (error) {
      console.error("Error during authentication:", error);

      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Email is already registered. Please log in instead.");
        setAction("Login");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email format. Please check and try again.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("Password is too weak. Please choose a stronger password.");
      } else if (error.code === "auth/user-not-found") {
        setErrorMessage("No account found with this email. Please sign up.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="inputs">
        {action === "Sign Up" && (
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
        )}
        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Email ID"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleInputChange}
            value={formData.password}
          />
        </div>
      </div>

      {action === "Login" && (
        <div className="forgot-password">
          Forgot Password? <span>Click Here!</span>
        </div>
      )}

      <div className="submit-container">
        <div className="submit blue" onClick={handleSubmit}>
          {action === "Login" ? "Login" : "Sign Up"}
        </div>
        <div
          className="submit blue"
          onClick={() => setAction(action === "Login" ? "Sign Up" : "Login")}
        >
          {action === "Login" ? "Sign Up" : "Login"}
        </div>
      </div>

      {/* Google Sign-In button placed below Login/Sign-Up buttons */}
      <div className="google-signin">
        <SigninWithGoogle />
      </div>
    </div>
  );
};

export default LoginSignup;
