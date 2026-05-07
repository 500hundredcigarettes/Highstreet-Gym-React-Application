import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { handleSessionBooking } from "./handleSessionBooking";
import { fetchAPI } from "../api.mjs";

const CreateSessionView = ({
  allSessions,
  allActivities,
  allLocations,
  user
}) => {
  const navigate = useNavigate();
  const { sessionId, setSessionId, proceedToEditBooking, setProceedToEditBooking } = handleSessionBooking();


  // Find current session if editing
  const currentSession = allSessions.find((s) => s.id === sessionId);

  const [formData, setFormData] = useState({
    sessionDate: "",
    sessionTime: "",
    selectActivity: "",
    selectLocation: "",
  });

  const [sessionStatus, setSessionStatus] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (currentSession) {
      setFormData({
        sessionDate: currentSession.sessionDate.split("T")[0], // YYYY-MM-DD
        sessionTime: currentSession.sessionTime.slice(0, 5), // HH:MM
        selectActivity: currentSession.activityId.id.toString(),
        selectLocation: currentSession.locationId.id.toString(),
      });
    } else {
      // Default for create mode
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        sessionDate: today,
        sessionTime: "09:00",
        selectActivity: allActivities[0]?.id.toString() || "",
        selectLocation: allLocations[0]?.id.toString() || "",
      });
    }
  }, [currentSession, allActivities, allLocations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSessionStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSessionStatus("");

    const payload = {
      ...formData,
      sessionTime: formData.sessionTime + ":00",
      selectActivity: parseInt(formData.selectActivity),
      selectLocation: parseInt(formData.selectLocation),
      selectTrainer: user.id,
      ...(currentSession && { sessionId: currentSession.id }),
    };

      if (currentSession) {
        fetchAPI("PATCH", "/sessions/edit", payload, user.authenticationKey).then(response => setSessionStatus(response.body.message));
      } else {
        await fetchAPI("POST", "/sessions/create", payload, user.authenticationKey).then(response => setSessionStatus(response.body.message));
      }
  };

  const handleDelete = async () => {
    if (!currentSession || !window.confirm("Are you sure you want to delete this session?")) return;

    fetchAPI("DELETE", "/sessions/delete", {
      sessionId: currentSession.id
    }, user,authenticationKey).then(response => setSessionStatus(response.body.message))
      
  };

  const handleCancel = () => {
    setSessionId(null);
    setProceedToEditBooking(false);
    navigate("/sessions");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {currentSession ? "Edit Session" : "Create New Session"}
      </h1>

      {sessionStatus && (
        <div className="mb-4 p-4 bg-red-100 border border-white text-sky-700 rounded">
          {sessionStatus}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            name="selectLocation"
            value={formData.selectLocation}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a location</option>
            {allLocations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.locationTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Activity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activity
          </label>
          <select
            name="selectActivity"
            value={formData.selectActivity}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an activity</option>
            {allActivities.map((act) => (
              <option key={act.id} value={act.id}>
                {act.activityName}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            name="sessionDate"
            min="2025-11-26"
            max="2026-12-31"
            value={formData.sessionDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time
          </label>
          <input
            type="time"
            name="sessionTime"
            min="09:00"
            max="20:00"
            value={formData.sessionTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Trainer (Read-only for Trainer) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trainer
          </label>
          <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
            {user.firstName} {user.lastName} (You)
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <div className="space-x-3">
            {currentSession && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition"
              >
                Delete Session
              </button>
            )}

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {currentSession ? "Update Session" : "Create Session"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateSessionView;