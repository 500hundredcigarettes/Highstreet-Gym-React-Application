import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"
import { useAuthenticate } from "../authentication/useAuthenticate.jsx";
    
  export function Profile() {
    const { user } = useAuthenticate()

    if(!user) {
      return <div>Loading Profile...</div>
    }

    return (
      <div className="flex flex-col m-8 gap-5">
      <h2 className="text-3xl font-bold">Name:</h2>
      <p className="p-2 bg-sky-300 rounded-lg text-xl font-bold">{user.firstName} {user.lastName}</p>

      <h2 className="text-3xl font-bold">Email:</h2>
      <p className="p-2 bg-sky-300 rounded-lg text-xl font-bold">{ user.email }</p>
      
      <h2 className="text-3xl font-bold">Address:</h2>
      <p className="p-2 bg-sky-300 rounded-lg text-xl font-bold">{ user.address }</p>
      
      <h2 className="text-3xl font-bold">Phone Number:</h2>    
      <p className="p-2 bg-sky-300 rounded-lg text-xl font-bold">{ user.phoneNumber }</p>
      
      <h2 className="text-3xl font-bold">Gym:</h2>
      <p className="p-2 bg-sky-300 rounded-lg text-xl font-bold">{ user.gymId.locationTitle }</p>
    </div>
    )
  }

  export default Profile