import express from "express"
import { SessionModel } from "../models/SessionModel.mjs"
import { BookingModel } from "../models/BookingModel.mjs"
import { UserModel } from "../models/UserModel.mjs"
import { AuthenticationController } from "./AuthenticateController.mjs"

export class BookingController {
  /** @type {express.Router} */
  static routes = express.Router()

  /**
   * Configures routes for booking endpoints.
   * @static
   */
  static {
    this.routes.get('/', this.renderBookings)
    this.routes.get('/:id', AuthenticationController.restrict(["Admin"]), this.renderBookingsAdmin)

    this.routes.post("/delete", this.deleteBooking)
    this.routes.post('/:id', AuthenticationController.restrict(["Admin"]), this.updateBooking)
  }
  
  /**
   * Renders the booking page.
   * @param {express.Request} req - id of the logged in user.
   * @param {express.Response} res - Renders view for the bookings page for non-admin users.
   */
  static async renderBookings(req, res) {
    let user = await UserModel.getById(req.session.savedUserId) ?? 'Guest'
    let bookings = await BookingModel.getAll().then(bookings => bookings)

    if (user && user.role == 'Trainer') {
      res.render('bookings.ejs', {userBookings: [], user, selectedUser: null})
    } else if (user) {
      let userBookings = bookings.filter(booking => booking.userId.id == user.id)
      userBookings.sort((a, b) => a.sessionId.sessionDate - b.sessionId.sessionDate)
      res.render('bookings.ejs', {userBookings, user, selectedUser: null})
    } else {
      res.render('bookings.ejs', {userBookings: [], user: null, selectedUser: null})
    }
  }

  /**
   * Renders the admin booking view for the current admin.
   * or view for the bookings the admin is editing
   * @param {express.Request} req -  id of the current admin and selected user.
   * @param {express.Response} res - Renders view for the bookings page for 
   * admin users or the user being edited.
   */
  static async renderBookingsAdmin(req, res) {
    let user = await UserModel.getById(req.session.savedUserId)
    let selectedUser = await UserModel.getById(req.params.id) ?? 'Guest'
    BookingModel.getAll().then((bookings) => {
      if (selectedUser.role == "Trainer") {
      let userBookings = bookings.filter(booking => booking.sessionId.trainerId.id == user.id)
        SessionModel.getAll()
        .then((allSessions) => { 
        res.render('bookings.ejs', {userBookings, user, selectedUser, allSessions, selectMessage: 'Select a week to view what sessions are on when'})
        })
      } else {
        let userBookings = bookings.filter(booking => booking.userId.id == selectedUser.id)
        SessionModel.getAll()
        .then((allSessions) => { 
        res.render('bookings.ejs', {userBookings, user, selectedUser, allSessions, selectMessage: 'Select a week to view what sessions are on when'})
        })
      }
    })
  }

  /**
   * handles updating and replacing of an existing booking
   * @param {express.Request} req - id of the selected user, booking and session that 
   * will replace the session in the existing booking.
   */
  static async updateBooking(req, res) {
  const { formAction, updatedSessionId, sessionId, bookingId } = req.body
  const userId = parseInt(req.params.id)


 if (formAction === 'create') {
    await BookingModel.create(sessionId, userId)
  } else if (formAction === 'update') {
    let updatedBooking = {
      sessionId: parseInt(updatedSessionId),
      userId: userId,
      id: parseInt(bookingId)
    };
    await BookingModel.update(updatedBooking);
  }
  }

   /**
   * Calculates the week number for a given date.
   * @static
   * @param {Date|string} [date=new Date()] - The date to calculate the week number for.
   * @returns {number} The week number of the year.
   */
  static getDateWeek(date) {
    const currentDate =  (typeof date === 'object') ? date : new Date()

    const januaryFirst = new Date(currentDate.getFullYear(), 0, 1)

    const daysToNextMonday = (januaryFirst.getDay() === 1) ? 
    0 : (7 - januaryFirst.getDay()) % 7

    const nextMonday = new Date(currentDate.getFullYear(), 0, januaryFirst.getDate() + daysToNextMonday)

    return (currentDate < nextMonday) ? 52 : 
    (currentDate > nextMonday ? Math.ceil(
    (currentDate - nextMonday) / (24 * 3600 * 1000) / 7) : 1);
  }

  /**
   * handles the deletion of an existing booking
   * @param {express.Request} req - id of the existing booking.
   */
  static deleteBooking(req, res) {
    BookingModel.delete(req.body.deleteId)
  }
}