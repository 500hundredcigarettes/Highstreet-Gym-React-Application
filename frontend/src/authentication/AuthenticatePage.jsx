import React, { useState } from "react";
import Login from "./LoginView";
import Signup from "./SignupView";

function AuthenticatePage() {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div>
      <div className="flex justify-center m-5">
        <button onClick={toggleForm}>
          {showLogin ? 'Switch to Signup' : 'Switch to Login'}
        </button>
      </div>

      {showLogin ? <Login /> : <Signup />}
    </div>
  );
}

export default AuthenticatePage;