import express from "express"
import bcrypt from "bcryptjs"
import { AuthenticationController } from "./AuthenticateController.mjs"
import { ActivityModel } from "../models/ActivityModel.mjs"
import { LocationModel } from "../models/LocationModel.mjs"
import { UserModel } from "../models/UserModel.mjs"
/**
 * Controller for rendering main admin view and 
 * CRUD operations for activities and locations, 
 * as well as handling the creation of new users 
 * @class
 */
export class AdminController {
  /** @type {express.Router} */
  static routes = express.Router()



  /**
   * Configures routes for admin endpoints.
   * @static
   */
  static {

    this.routes.get("/", AuthenticationController.restrict(["Admin"]), this.userList)
    this.routes.get("/editmore", AuthenticationController.restrict(["Admin"]), this.renderActivitiesLocations)
    this.routes.get("/bookings", AuthenticationController.restrict(["Admin"]), this.renderAdminBookings)

    this.routes.post("/", AuthenticationController.restrict(["Admin"]), this.handleCreateUser);
    this.routes.post("/editmore", AuthenticationController.restrict(["Admin"]), this.handleActivitiesLocations)
    this.routes.post("/bookings", AuthenticationController.restrict(["Admin"]), this.handleBookings)
  }

  /**
   * Renders the main admin page.
   * @param {express.Response} res - Renders view for the admin home page.
   */
  static async userList(req, res) {
    const gyms = await LocationModel.getAll().then(locations => locations) 
    const users = await UserModel.getAll().then(users => users)
    res.render("users.ejs", { users, gyms })
  }


  /**
   * Handles creation of a new user
   * @param {express.Request} req - form data object containing all details for
   * a new user that will be registered in the database.
   */
static async handleCreateUser(req, res) {
  const formData = req.body
  const emailCheck = await UserModel.getByEmail(formData.email) 
  let gymId = await LocationModel.getByLocationTitle(formData.gym)

  const user = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    role: formData.role ?? 'Member',
    password: formData.password,
    email: formData.email,
    address: formData.address,
    gymId: gymId.id,
    phoneNumber: formData.phoneNumber
  }

    if (formData.password == formData.confirmPassword && emailCheck == undefined) {
      if(!user.password.startsWith("$2b")) {
          user.password = bcrypt.hashSync(user.password)
    }
    UserModel.create(user)
    } else {
      res.status(502).render("error_status.ejs", {
        status: "Invalid email account",
        message: "An account is already registered with the submitted email",
        redirect: "admin",
        redirectMessage: "Return to admin page"
      })
    }
  }

  /**
   * Renders view for updating, deleting or creating activities and locations
   * @param {express.Response} res - renders the initial view for the activity list.
   */
  static async renderActivitiesLocations(req, res) {
    let activities = await ActivityModel.getAll().then(activity => activity)
    let locations = await LocationModel.getAll().then(location => location)
    res.render('activity_locations.ejs', {activities, locations})
  }

  /**
   * Handles activity and location CRUD operations (Creating or deleting locations or activities 
   * and editing existing location and activity details)
   * @param {express.Response} req - form object that includes the location or activity id and details 
   * and its request for a specific operation.
   */
  static async handleActivitiesLocations(req, res) {
    if (req.body.action == 'createLocation') {
      let location = {
        locationTitle: req.body.locationTitle,
        locationAddress: req.body.locationAddress
      }
      LocationModel.create(location)
    }
    
    if (req.body.action == 'createActivity') {
      let activity = {
        activityName: req.body.activityName,
        activityDescription: req.body.activityDescription
      }
      ActivityModel.create(activity)
    }

    if (req.body.action == 'editLocation') {
      let location = {
        locationTitle: req.body.locationTitle,
        locationAddress: req.body.locationAddress,
        id: parseInt(req.body.locationId)
      }
      LocationModel.update(location)
    }
    
    if (req.body.action == 'editActivity') {
      let activity = {
        activityName: req.body.activityName,
        activityDescription: req.body.activityDescription,
        id: parseInt(req.body.activityId)
      }
      ActivityModel.update(activity)
    }

    if (req.body.action == 'deleteLocation') {
      LocationModel.delete(req.body.locationId)
    }
    
    if (req.body.action == 'deleteActivity') {
      ActivityModel.delete(req.body.activityId)
    }
  }

  static async renderAdminBookings(req, res) {
    let user = await UserModel.getById(req.session.savedUserId)
    let allBookings = await BookingModel.getAll().then(bookings => bookings)
    let allUsers = await UserModel.getAll().then(users => users)
    let allSessions = await SessionModel.getAll().then(sessions => sessions)
    res.render('admin_bookings.ejs', {user, allBookings, allUsers, allSessions})
  }

  static async handleBookings(req, res) {
      const { formAction, updatedSessionId, sessionId, bookingId, userId } = req.body
    
    
     if (formAction === 'create') {
        await BookingModel.create(sessionId, userId)
      } else if (formAction === 'update') {
        let updatedBooking = {
          sessionId: parseInt(updatedSessionId),
          userId: parseInt(userId),
          id: parseInt(bookingId)
        };
        await BookingModel.update(updatedBooking);
      } else if (formAction === 'delete') {
        BookingModel.delete(req.body.deleteId)
      }
  }
}
