import express from "express"
import { SessionModel } from "../models/SessionModel.mjs"
import { ActivityModel } from "../models/ActivityModel.mjs"
import { LocationModel } from "../models/LocationModel.mjs"
import { BookingModel } from "../models/BookingModel.mjs"
import { UserModel } from "../models/UserModel.mjs"
import { AuthenticationController } from "./AuthenticateController.mjs"

/**
 * Controller for handling session-related operations, including rendering sessions,
 * creating bookings, and managing session CRUD operations for admin users.
 * @class
 */
export class SessionController {
  /** @type {express.Router} */
  static routes = express.Router()

  /**
   * Configures routes for session-related endpoints.
   * @static
   */
  static {
    this.routes.get("/", this.viewSessions)
    this.routes.get(
      "/create",
      AuthenticationController.restrict(["Admin", "Trainer"]),
      this.renderEditSessions
    )
    this.routes.get("/:sessionId", AuthenticationController.restrict(["Admin", "Member"]), this.createBooking)
    this.routes.get(
      "/create/:sessionId",
      AuthenticationController.restrict(["Admin", "Trainer"]),
      this.renderEditSessions
    )
    this.routes.post("/", this.renderSessionsByWeek)
    this.routes.post(
      "/create",
      AuthenticationController.restrict(["Admin", "Trainer"]),
      this.handleEditSession
    )
    this.routes.post("/:sessionId", this.confirmBooking)
    this.routes.post(
      "/create/:sessionId",
      AuthenticationController.restrict(["Admin", "Trainer"]),
      this.handleEditSession
    )
  }

  /**
   * Renders the sessions view for the current week.
   * @param {express.Request} req - id of the logged in user.
   * @param {express.Response} res - Renders initial view for schedule page.
   */
  static async viewSessions(req, res) {
    const savedUserId = req.session.savedUserId
    const user = (await UserModel.getById(savedUserId)) ?? "Guest"
    const week = SessionController.getDateWeek(new Date())
    const uniqueSessions = await SessionModel.getByDateRange()
    res.render("sessions.ejs", {
      user,
      uniqueSessions,
      week,
      startDate: "",
      endDate: "",
      selectMessage: "Select a week to view what sessions are on when",
    })
  }

  /**
   * Renders sessions filtered by a specific week.
   * @param {express.Request} req - Request object containing the week number in the body.
   * @param {express.Response} res - Renders page with sessions that occur within the week.
   */
  static async renderSessionsByWeek(req, res) {
    const week = req.body.week
    const savedUserId = req.session.savedUserId
    const user = (await UserModel.getById(savedUserId)) ?? "Guest"
    const [yearString, weekNumberString] = week.split("-W")
    const year = parseInt(yearString, 10)
    const weekNumber = parseInt(weekNumberString, 10)

    const januaryFirst = new Date(year, 0, 1)
    const daysToAdd = (weekNumber - 1) * 7
    let startDate = new Date(januaryFirst)
    startDate.setDate(januaryFirst.getDate() + daysToAdd - januaryFirst.getDay() + 1)
    let endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)

    const sessions = await SessionModel.getByDateRange(startDate, endDate)
    
    if (user.role === 'Trainer' || user.role === 'Admin') {
      
      let uniqueSessions
      user.role === 'Trainer' ? uniqueSessions = sessions.filter(session => session.trainerId.id == user.id) : uniqueSessions = sessions
      
      res.render("sessions.ejs", {
        user,
        uniqueSessions,
        week,
        startDate,
        endDate,
        selectMessage:
        uniqueSessions.length === 0
        ? "Nothings been booked this week, sorry!"
        : "",
      })
    } else {
      const uniqueSessions = sessions.filter(
        (session, index, self) =>
          index ===
        self.findIndex(
          (duplicate) =>
            duplicate.sessionDate.getTime() === session.sessionDate.getTime() &&
          duplicate.activityId.id === session.activityId.id
        )
      )
      
      res.render("sessions.ejs", {
        user,
        uniqueSessions,
        week,
        startDate,
        endDate,
        selectMessage:
        uniqueSessions.length === 0
        ? "Nothings been booked this week, sorry!"
        : "",
      })
    }
  }

  /**
   * Renders the booking creation page for a specific session.
   * @param {express.Request} req - request object containing the sessionId in params.
   * @param {express.Response} res - renders view for creating a booking.
   */
  static async createBooking(req, res) {
    const sessionId = req.params.sessionId
    const user = "Guest"
    const sessions = await SessionModel.getAll()
    const selectedSession = sessions.find((session) => session.id == sessionId)

    if (selectedSession) {
      const sharedSessions = sessions.filter(
        (session) =>
          session.activityId.id === selectedSession.activityId.id &&
          session.sessionDate.getTime() === selectedSession.sessionDate.getTime()
      )
      res.render("create_booking.ejs", { sessionId, sharedSessions, user })
    } else {
      res.render("error_status.ejs", {
        status: "Unknown session",
        message: "The session you have tried to book does not exist or could not be found",
        redirect: "sessions",
        redirectMessage: "Return to session page"
      })
    }
  }

  /**
   * Confirms a booking for a specific session.
   * @param {express.Request} req - Request object containing the sessionId in params.
   * @param {express.Response} res - Can respond with an error status that the user is not registered.
   */
  static async confirmBooking(req, res) {
    const sessionId = parseInt(req.params.sessionId)
    const savedUserId = req.session.savedUserId
    const bookings = await BookingModel.getAll()
    const userBookings = bookings.filter(
      (booking) => booking.userId.id == savedUserId
    )

    if (!savedUserId) {
      res.status(500).render("error_status.ejs", {
        status: "User not logged into account",
        message: "You must register an account and be logged in to be able to make a booking for a gym session",
        redirect: "authenticate",
        redirectMessage: "Redirect to login page"
      })
      } else if (userBookings.find((booking) => booking.sessionId.id === sessionId)) {
        res.status(400).render("error_status.ejs", {
          status: "Booking unsuccessful",
          message : "The session you have tried to book has already been booked. You cannot book duplicate sessions.",
          redirect: "sessions",
          redirectMessage: "Return to schedule page"
        })
      } else {
      await BookingModel.create(sessionId, savedUserId)
    }
  }

  /**
   * Calculates the week number for a given date.
   * @static
   * @param {Date|string} [date=new Date()] - The date to calculate the week number for.
   * @returns {number} The week number of the year.
   */
  static getDateWeek(date = new Date()) {
    const currentDate = typeof date === "object" ? date : new Date()
    const januaryFirst = new Date(currentDate.getFullYear(), 0, 1)
    const daysToNextMonday =
      januaryFirst.getDay() === 1 ? 0 : (7 - januaryFirst.getDay()) % 7
    const nextMonday = new Date(
      currentDate.getFullYear(),
      0,
      januaryFirst.getDate() + daysToNextMonday
    )

    return currentDate < nextMonday
      ? 52
      : Math.ceil((currentDate - nextMonday) / (24 * 3600 * 1000) / 7) || 1
  }

  /**
   * Renders the session editing page for admins or trainers.
   * @param {express.Request} req - Request object containing the id of the 
   * user that is logged in and the sessionId in params (optional).
   * @param {express.Response} res - Renders view for editing sessions.
   */
  static async renderEditSessions(req, res) {
    const savedUserId = req.session.savedUserId
    const trainers = await UserModel.getTrainers()
    const locations = await LocationModel.getAll()
    const activities = await ActivityModel.getAll()
    const sessionId = req.params.sessionId
    const user = await UserModel.getById(savedUserId)
    const sessions = await SessionModel.getAll()
    const selectedSession = sessions.find((session) => session.id == sessionId) ?? new SessionModel(null, "", "", "", "", "")
      

    res.render("create_sessions.ejs", {
      trainers,
      locations,
      activities,
      selectedSession,
      user,
    })
  }

  /**
   * Handles session creation, update, or deletion based on the action specified.
   * @param {express.Request} req - Request object containing session data in the body and optional sessionId in params.
   */
  static async handleEditSession(req, res) {
    const sessions = await SessionModel.getAll()
    const createdSession = req.body
    const sessionId = req.params.sessionId  
    if (createdSession.action === "create") {
      const duplicateCreatedSession = sessions.some(session =>  
        session.sessionTime == createdSession.sessionTime + ":00" && 
        DatabaseModel.toMySqlDate(session.sessionDate) + "" == createdSession.sessionDate + "" && 
        session.activityId.id == parseInt(createdSession.selectActivity) &&
        session.locationId.id == parseInt(createdSession.selectLocation)
      )
      if (duplicateCreatedSession) {
        res.render("error_status", {
          status: "Duplicate session cannot be created",
          message: "A session already exists with the approximate date, time, activity and location that you have entered.",
          redirect: "sessions/create",
          redirectMessage: "Return to creating sessions page"
        })  
      } else {
      const createSession = {
        sessionDate: createdSession.sessionDate,
        sessionTime: createdSession.sessionTime,
        activityId: createdSession.selectActivity,
        trainerId: createdSession.selectTrainer,
        locationId: createdSession.selectLocation,
      }
        await SessionModel.create(createSession)
      }
    } else if (createdSession.action === "update") {
        const duplicateCreatedSession = sessions.some(session =>  
        session.sessionTime == createdSession.sessionTime + ":00" && 
        DatabaseModel.toMySqlDate(session.sessionDate) + "" == createdSession.sessionDate + "" && 
        session.activityId.id == parseInt(createdSession.selectActivity) &&
        session.locationId.id == parseInt(createdSession.selectLocation)
      )

      if (duplicateCreatedSession) {
        res.render("error_status", {
          status: "Session could not be updated",
          message: "A session already exists with the approximate date, time, activity and location that you have entered.",
          redirect: "sessions/create",
          redirectMessage: "Return to creating sessions page"
        })  
      } else {
        const updateSession = {
          sessionDate: createdSession.sessionDate,
          sessionTime: createdSession.sessionTime,
          activityId: createdSession.selectActivity,
          trainerId: createdSession.selectTrainer,
          locationId: createdSession.selectLocation,
          id: parseInt(sessionId),
        }
        await SessionModel.update(updateSession)
      }
    } else if (createdSession.action === "delete") {
      await SessionModel.delete(parseInt(sessionId))
    }
  }
}