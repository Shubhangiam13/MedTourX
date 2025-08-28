import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  // Your Firebase config here
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"

  apiKey: "AIzaSyB_skwPfOylvbHkkBBFQ3q5FpsIu3mnY4k",
  authDomain: "login-auth-13065.firebaseapp.com",
  projectId: "login-auth-13065",
  storageBucket: "login-auth-13065.firebasestorage.app",
  messagingSenderId: "451842663963",
  appId: "1:451842663963:web:0422c04743e68685d43abe"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account'
  });

// export const signInWithGoogle = async () => {
//   try {
    // const result = await signInWithPopup(auth, provider);
    // return result;
//   } catch (error) {
    // if (error.code !== 'auth/popup-closed-by-user') {
        // console.error('Google Sign-in error:', error);
    //   }
    // throw error;
//   }
// };

export const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // Send user data to your backend
      const response = await fetch('http://localhost:3001/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to authenticate with server');
      }
      
      return result;
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Sign-in popup closed by user');
        return null;
      }
      console.error('Google Sign-in error:', error);
      throw error;
    }
  };