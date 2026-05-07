import { useEffect, useState } from "react"
import { useAuthenticate } from "../authentication/useAuthenticate"
import { useNavigate } from "react-router"
import { FaPlus, FaRegWindowClose, FaTrashAlt } from "react-icons/fa";
import { fetchAPI } from "../api.mjs"
import XMLDownloadButton from "../common/XMLButton";


export const ExportXml = ({
  user
}) => {
  if (user.role == 'Member') {
    return (
      <div>
        <h1>Export xml for members</h1>
        <XMLDownloadButton
          route="/sessions/bookingxml"
          filename="bookings.xml"
          authenticationKey={user && user.authenticationKey}
          className="btn btn-warning">Export previous bookings</XMLDownloadButton>
      </div>
    )
  } else if (user.role == 'Trainer') {
    return (
      <div>
        <h1>Export xml for trainers</h1>
        <XMLDownloadButton
          route="/sessions/sessionxml"
          filename="trainerSessions.xml"
          authenticationKey={user && user.authenticationKey}
          className="btn btn-warning">Export your sessions</XMLDownloadButton>
      </div>
    )
  }
  
}

export default ExportXml