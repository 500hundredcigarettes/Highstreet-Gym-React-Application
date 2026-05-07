import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"
import { useAuthenticate } from "../authentication/useAuthenticate.jsx";
import { FaRegEdit, FaRegWindowClose } from "react-icons/fa";
import { fetchAPI } from "../api.mjs";
import ExportXml from "./ExportView.jsx";


export function ExportPage() {
  const { user } = useAuthenticate()
  
  if (!user) {
    return <div>Loading export...</div>;
  }
  
return (

  <div>
    <ExportXml user={user}></ExportXml>
  </div>
);

}

export default ExportPage;