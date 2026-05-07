import { useNavigate } from "react-router"
import { handleSessionBooking } from "./handleSessionBooking"
import { useState, useEffect } from "react"
import { fetchAPI } from "../api.mjs"

export const CreateBooking = ({
  allSessions,
  user
}) => {
    const {sessionId, setSessionId, proceedToBooking, setProceedToBooking} = handleSessionBooking()

    const currentSession = allSessions.find(session => session.id == sessionId)

    const sharedSessions = allSessions.filter((session) => session.activityId.id == currentSession.activityId.id && 
    new Date(session.sessionDate).getTime() == new Date(currentSession.sessionDate).getTime()
    )

    const uniqueTrainers = [];
    const trainerMap = new Map();

    for (const session of sharedSessions) {
      const trainerId = session.trainerId.id;
      if (!trainerMap.has(trainerId)) {
        trainerMap.set(trainerId, true);
        uniqueTrainers.push(session.trainerId);
      }
    }

    const [selectedTrainerId, setSelectedTrainerId] = useState(currentSession.trainerId.id);
    const [bookingStatus, setBookingStatus] = useState ("")

    useEffect(() => {
      setSelectedTrainerId(currentSession.trainerId.id);
    }, [sessionId]);

    const availableSessions = sharedSessions.filter(session => 
      session.trainerId.id === selectedTrainerId
    )

    const dayMap = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]

    let rawDate = new Date(currentSession.sessionDate) + ''
    let formattedSessionDate = rawDate.slice(4, 10).split(/\b/).reverse()

    let dayOfSession = dayMap[new Date(currentSession.sessionDate).getDay()]

    const handleTrainerChange = (event) => {
      const newTrainerId = parseInt(event.target.value);
      setSelectedTrainerId(newTrainerId);
      const firstSession = sharedSessions.find(s => s.trainerId.id === newTrainerId);
      if (firstSession) {
        setSessionId(firstSession.id);
      }
    };

    const handleSessionChange = (event) => {
      setSessionId(parseInt(event.target.value));
    };

  return <section className="flex flex-col gap-4 p-10 items-center">
    <p id="session-day">({dayOfSession})</p>
    <p id="session-activity">{currentSession.activityId.activityName}</p>
    <p id="session-date">{formattedSessionDate[0] + ' ' + formattedSessionDate[2]} - {currentSession.locationId.locationTitle.replace(" High Street Gym", "")}</p>

    <select name="selectTime" id="select-time" onChange={handleSessionChange}>
      {availableSessions.map((session) => (
        <option key={session.id} value={session.id} selected={session.id === sessionId}>
          {session.sessionTime}
        </option>
      ))}
    </select>

    <select name="selectTrainer" id="select-trainer" onChange={handleTrainerChange}>
      {uniqueTrainers.map((trainer) => (
        <option key={trainer.id} value={trainer.id} selected={trainer.id === selectedTrainerId}>
          {trainer.firstName + ' ' + trainer.lastName}
        </option>
      ))}
    </select>

    <p>{bookingStatus}</p>

    <button className="text-white bg-sky-300 p-3 text-xl rounded-lg w-60" onClick={() => {fetchAPI("POST", "/sessions/book", {sessionId, user}, user.authenticationKey).then(response => setBookingStatus(response.body.message))}}>Confirm Booking</button>

    <button className="bg-white text-sky-300 p-3 text-xl rounded-lg w-60" onClick={() => {setProceedToBooking(!proceedToBooking)}}>Cancel Booking</button>
  </section>
  }

export default CreateBooking