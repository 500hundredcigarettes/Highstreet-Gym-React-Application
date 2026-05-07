import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"
import { useAuthenticate } from "../authentication/useAuthenticate.jsx";
import { FaRegEdit, FaRegWindowClose } from "react-icons/fa";
import Profile from "./ProfileView.jsx";
import EditProfile from "./EditProfileView.jsx";


export function ProfilePage() {
  const { refresh } = useAuthenticate()
  const [showDefaultProfile, setShowDefaultProfile] = useState(true)

  const toggleEdit = () => {
    setShowDefaultProfile(!showDefaultProfile)
    refresh()
  }

return (
  <div>
    <div className="flex justify-end">
      <button className={showDefaultProfile ? "text-3xl text-sky-300 bg-white p-2.5 mt-6 mr-6 rounded-full absolute" : "text-4xl text-sky-300 p-3 rounded-2xl absolute"} onClick={toggleEdit}>
        {showDefaultProfile ? <FaRegEdit />: <FaRegWindowClose />}
      </button>
    </div>
    {showDefaultProfile ? <Profile />: <EditProfile />}

  </div>
);

}

export default ProfilePage;