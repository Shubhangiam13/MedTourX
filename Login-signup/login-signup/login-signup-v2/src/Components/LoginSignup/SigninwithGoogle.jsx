import React from "react";
import googleIcon from "../Assets/google.png"; // Adjust the path if necessary
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from '../../firebase.js';

function SigninWithGoogle() {

  function googleLogin(){
    const provider=new GoogleAuthProvider();
    signInWithPopup(auth,provider).then(async(result) => {
      console.log(result);
    });
  }
  return ( 
    <div>
      <p className="continue-p">--Or continue with--</p>
      <div 
      style={{display:"flex",justifyContent:"center",cursor:"pointer"}}
      onClick={googleLogin}
      >
      <img src={googleIcon} alt="Google Sign-In" width={"60%"}  />
        
      </div>
    </div>
  );
}

export default SigninWithGoogle;

