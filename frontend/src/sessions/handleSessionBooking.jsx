import { createContext, useCallback, useContext, useEffect, useState } from "react"

export const SessionContext = createContext(null)

export function SessionIdProvider({ children }) {
    const [sessionId, setSessionId] = useState()
    const [proceedToBooking, setProceedToBooking] = useState(true);
    const [proceedToEditBooking, setProceedToEditBooking] = useState(true)
    
  const clearSessionId = () => {
    setSessionId(null);
  };

    
    // Provide user and status state to all children via context
    return <SessionContext.Provider value={[sessionId, setSessionId, proceedToBooking, setProceedToBooking, proceedToEditBooking, setProceedToEditBooking]}>
        {children}
    </SessionContext.Provider>
}

export function handleSessionBooking() {
    const [sessionId, setSessionId, proceedToBooking, setProceedToBooking, proceedToEditBooking, setProceedToEditBooking] = useContext(SessionContext)

    const renderBookingPage = useCallback((id) => {
      setSessionId(id)
      setProceedToBooking((prev) => !prev);
    }, [setSessionId, setProceedToBooking])

    const renderEditBookingPage = useCallback((id) => {
      setSessionId(id)
      setProceedToEditBooking((prev) => !prev);
    }, [setSessionId, setProceedToEditBooking])

    return {
      renderBookingPage,
      renderEditBookingPage,
      proceedToEditBooking, 
      setProceedToEditBooking,
      proceedToBooking,
      setProceedToBooking,
      setSessionId,
      sessionId
    }
}