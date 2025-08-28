import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Success = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Show success toast when the page loads
        toast.success('Payment successful!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        // Redirect to home page after 5 seconds
        const timeout = setTimeout(() => {
            navigate('/'); // Redirect to the home page
        }, 5000);

        // Cleanup timeout on component unmount
        return () => clearTimeout(timeout);
    }, [navigate]);

    return (
        <div className="success-container">
            <div className="success-content">
                <h1>Payment Successful</h1>
                <p>Your payment has been successfully processed. Your appointment is confirmed!</p>
            </div>
            <ToastContainer />

            {/* Internal CSS */}
            <style jsx>{`
          .success-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f9fc; /* Light blue background */
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
  
          .success-content {
            text-align: center;
            background-color: white;
            padding: 40px 60px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 400px;
            max-width: 100%;
          }
  
          .success-content h1 {
            color: #1a73e8; /* Blue text color */
            font-size: 2rem;
            margin-bottom: 15px;
          }
  
          .success-content p {
            color: #333;
            font-size: 1.1rem;
            line-height: 1.5;
          }
  
          .success-content .button {
            margin-top: 20px;
            background-color: #1a73e8; /* Blue button */
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
  
          .success-content .button:hover {
            background-color: #1558b0; /* Darker blue on hover */
          }
  
          /* Toast styling */
          .Toastify__toast--success {
            background-color: #1a73e8; /* Blue color for success toast */
            color: white;
            font-weight: bold;
          }
  
          .Toastify__toast-body {
            font-size: 1.1rem;
          }
        `}</style>
        </div>
    );
};



export default Success;
