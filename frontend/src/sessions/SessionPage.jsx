import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"
import Sessions from "./SessionsView";
import CreateBooking from "./CreateBookingView";
import CreateSession from "./CreateSessionView.jsx";
import { useAuthenticate } from "../authentication/useAuthenticate.jsx";
import { SessionIdProvider } from "./handleSessionBooking.jsx";
import { handleSessionBooking } from "./handleSessionBooking";
import { fetchAPI } from "../api.mjs";

export function SessionPage() {
  const { user, refresh } = useAuthenticate()
  const [allSessions, setAllSessions] = useState([])
  const [allActivities, setAllActivities] = useState([])
  const [allLocations, setAllLocations] = useState([])

  useEffect(() => {
    fetchAPI("GET", "/sessions").then(response => {
      setAllSessions(response.body)
    })
  }, [setAllSessions]) 

useEffect(() => {
    fetchAPI("GET", "/sessions/activities").then(response => {
      setAllActivities(response.body)
    })
  }, [setAllActivities]) 

useEffect(() => {
    fetchAPI("GET", "/sessions/locations").then(response => {
      setAllLocations(response.body)
    })
  }, [setAllLocations]) 

  return (
    <SessionIdProvider>
      <SessionPageContent allSessions={allSessions} user={user} allActivities={allActivities} allLocations={allLocations}/>
    </SessionIdProvider>
  );
}

function SessionPageContent({ allSessions, user, allActivities, allLocations }) {
  const { proceedToBooking, proceedToEditBooking } = handleSessionBooking();

  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div>
      {user.role == 'Trainer' ? 
        proceedToEditBooking ? (
          <Sessions selectMessage="Select a session to edit" allSessions={allSessions} user={user} />
        ) : (
          <CreateSession allSessions={allSessions} allActivities={allActivities} allLocations={allLocations} user={user}></CreateSession>
        )
        :
        proceedToBooking ? (
          <Sessions selectMessage="Select a session to book" allSessions={allSessions} user={user} />
        ) : (
          <CreateBooking allSessions={allSessions} user={user} />
        )
      }
    </div>
  );
}

export default SessionPage;