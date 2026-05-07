import express from "express"
import { SessionModel } from "../../models/SessionModel.mjs"
import { ActivityModel } from "../../models/ActivityModel.mjs"
import { LocationModel } from "../../models/LocationModel.mjs"
import { BookingModel } from "../../models/BookingModel.mjs"
import { UserModel } from "../../models/UserModel.mjs"
import { APIAuthenticationController } from "./APIAuthenticationController.mjs"
import { DatabaseModel } from "../../models/DatabaseModel.mjs"

export class APISessionController {
  static routes = express.Router()

  static {
    this.routes.get("/", this.getAllSessions)
    this.routes.get("/activities", this.getAllActivities)
    this.routes.get("/locations", this.getAllLocations)
    this.routes.get("/bookingxml", APIAuthenticationController.restrict(["Member"]), this.bookingXMLData)
    this.routes.get("/sessionxml", APIAuthenticationController.restrict(["Trainer"]), this.sessionXMLData)
    
    this.routes.post("/book", APIAuthenticationController.restrict(["Member"]), this.confirmBooking)

    this.routes.post("/create", APIAuthenticationController.restrict(["Trainer"]), this.handleCreateSession)
    this.routes.patch("/edit", APIAuthenticationController.restrict(["Trainer"]), this.handleEditSession)
    this.routes.delete("/delete", APIAuthenticationController.restrict(["Trainer"]), this.handleDeleteSession)
  }


    /**
     * Gets all the session data and sends it to the client
     * 
     * @type {express.RequestHandler}
     * @openapi
     * /api/sessions:
     *      get:
     *          summary: "Send all session data from database"
     *          tags: [Sessions]
     *          responses:
     *              '200':
     *                  description: 'Session data sent successfully'
     *                  content:
     *                    application/json:
     *                      schema:
     *                        $ref: "#/components/schemas/Sessions"            
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
  static async getAllSessions(req, res) {
    const sessions = await SessionModel.getAll()
    res.status(200).json(sessions)
  }

    /**
     * Gets all the activity data and sends it to the client
     * 
     * @type {express.RequestHandler}
     * @openapi
     * /api/sessions/activities:
     *      get:
     *          summary: "Send all activity data from database"
     *          tags: [Activities]
     *          responses:
     *              '200':
     *                  description: 'activity data sent successfully'
     *                  content:
     *                    application/json:
     *                      schema:
     *                        $ref: "#/components/schemas/Activities"            
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
  static async getAllActivities(req, res) {
    const activities = await ActivityModel.getAll()
    res.status(200).json(activities)
  }

    /**
     * Gets all the session data and sends it to the client
     * 
     * @type {express.RequestHandler}
     * @openapi
     * /api/sessions/locations:
     *      get:
     *          summary: "Send all location data from database"
     *          tags: [Location]
     *          responses:
     *              '200':
     *                  description: 'Location data sent successfully'
     *                  content:
     *                    application/json:
     *                      schema:
     *                        $ref: "#/components/schemas/Location"            
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async getAllLocations(req, res) {
    const locations = await LocationModel.getAll()
    res.status(200).json(locations)
  }

    /**
     * Creates a new booking for the user who sent a session
     * 
     * @type {express.RequestHandler}
     * @openapi
     * /api/sessions/book:
     *      post:
     *          summary: "Sends a session to the server that will be booked"
     *          tags: [Sessions]
     *          security:
     *              - ApiKey: []
     *          responses:
     *              '200':
     *                  description: 'Booking made successfully'
     *                  content:
     *                    application/json:
     *                      schema:
     *                        $ref: "#/components/responses/Created"            
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
  static async confirmBooking(req, res) {
    let authenticationKey = req.headers["x-auth-key"]
    const sessionId = parseInt(req.body.sessionId)
    const user = await UserModel.getByAuthenticationKey(authenticationKey)
    const bookings = await BookingModel.getAll()
    const userBookings = bookings.filter(
      (booking) => booking.userId.id == user.id
    )

    if (!user) {
      res.status(500).json({
        message: "You must register an account and be logged in to be able to make a booking for a gym session",
      })
      } else if (userBookings.find((booking) => booking.sessionId.id === sessionId)) {
        res.status(400).json({
          message : "The session you have tried to book has already been booked. You cannot book duplicate sessions.",
        })
      } else {
      await BookingModel.create(sessionId, user.id)
      res.status(200).json({
        message: "Booking successfully created"
      })
    }
  }
    /**
     * Creates a new session based on the provided details
     * 
     * @type {express.RequestHandler}
     * @openapi
     * /api/sessions/create:
     *      post:
     *          summary: "Create a new session"
     *          tags: [Sessions]
     *          security:
     *              - ApiKey: []
     *          requestBody:
     *            required: true
     *            content:
     *              application/json:
     *                schema:
     *                  $ref: "#/components/schemas/Sessions"
     *          responses:
     *              '200':
     *                  description: 'Booking made successfully'
     *                  content:
     *                    application/json:
     *                      schema:
     *                        $ref: "#/components/responses/Created"    
     *              '500':
     *                  description: 'Error creating session, the session you are trying to create has the same details as an existing session'
     *                  content:
     *                    application/json:
     *                      schema:
     *                        $ref: "#/components/responses/Error"    
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
  static async handleCreateSession(req, res) {
    const sessions = await SessionModel.getAll()
    const createdSession = req.body
      const duplicateCreatedSession = sessions.some(session =>  
        session.sessionTime == createdSession.sessionTime + ":00" && 
        DatabaseModel.toMySqlDate(session.sessionDate) + "" == createdSession.sessionDate + "" && 
        session.activityId.id == parseInt(createdSession.selectActivity) &&
        session.locationId.id == parseInt(createdSession.selectLocation)
      )
      if (duplicateCreatedSession) {
        res.status(500).json({
          message: "A session already exists with the approximate date, time, activity and location that you have entered.",
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
      res.status(200).json({
        message: "Session successfully created"
      })
      }
    }

    /**
     * Edits an existing session based on the provided details
     * 
     * @type {express.RequestHandler}
     * @openapi
     * /api/sessions/edit:
     *      patch:
     *          summary: "Edit an existing session"
     *          tags: [Sessions]
     *          security:
     *              - ApiKey: []
     *          requestBody:
     *            required: true
     *            content:
     *              application/json:
     *                schema:
     *                  $ref: "#/components/schemas/Sessions"
     *          responses:
     *              '200':
     *                  description: 'Session edited successfully'
     *                  content:
     *                    application/json:
     *                      schema:
     *                        $ref: "#/components/responses/Created"    
     *              '500':
     *                  description: 'Error editing session, the edits provided make this sessions details the same as an existing session'
     *                  content:
     *                    application/json:
     *                      schema:
     *                        $ref: "#/components/responses/Error"    
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async handleEditSession(req, res) {
      const sessions = await SessionModel.getAll()
      const createdSession = req.body
      const sessionId = req.body.sessionId  

      const duplicateCreatedSession = sessions.some(session =>  
        session.sessionTime == createdSession.sessionTime + ":00" && 
        DatabaseModel.toMySqlDate(session.sessionDate) + "" == createdSession.sessionDate + "" && 
        session.activityId.id == parseInt(createdSession.selectActivity) &&
        session.locationId.id == parseInt(createdSession.selectLocation)
      )

      if (duplicateCreatedSession) {
        res.status(500).json({
          message: "A session already exists with the approximate date, time, activity and location that you have entered.",
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
      res.status(200).json({
        message: "Session has been updated"
      })
      }
    }

    /**
     * Deletes an existing session
     * 
     * @type {express.RequestHandler}
     * @openapi
     * /api/sessions/delete:
     *      delete:
     *          summary: "Delete an existing session"
     *          tags: [Sessions]
     *          security:
     *              - ApiKey: []
     *          responses:
     *              '200':
     *                  description: 'Session deleted successfully'
     *                  content:
     *                    application/json:
     *                      schema:
     *                        $ref: "#/components/responses/Updated"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
  static async handleDeleteSession(req, res) {
    const sessionId = req.body.sessionId  
    await SessionModel.delete(parseInt(sessionId))
    res.status(200).json({
        message: "Session has been deleted"
    })
  }

    /**
     * Handle exporting prior bookings into XML
     * 
     * @type {express.RequestHandler}
     * @openapi
     * /api/sessions/bookingxml:
     *      get:
     *          summary: "Export and convert members prior bookings into XML"
     *          tags: [Bookings]
     *          security:
     *              - ApiKey: [] 
     *          responses:
     *              '200':
     *                  description: 'Exporting bookings successfully completed'
     *                  content:
     *                      text/xml:
     *                          schema:
     *                              type: array
     *                              xml:
     *                                  name: booking
     *                              items:
     *                                  type: object
     *                                  properties:
     *                                      id: 
     *                                          type: string 
     *                                          example: 34 
     *                                      userId: 
     *                                          type: string 
     *                                          example: 51
     *                                      session: 
     *                                          type: object
     *                                          properties:
     *                                              sessionId:
     *                                                  type: string
     *                                                  example: 21
     *                                              sessionDate:
     *                                                  type: string
     *                                                  format: date
     *                                              sessionTime:
     *                                                  type: string
     *                                                  format: time
     *                                              activity: 
     *                                                  type: object
     *                                                  properties:
     *                                                      activityId:
     *                                                          type: string
     *                                                          example: 8
     *                                                      activityName:
     *                                                          type: string
     *                                                          example: Boxing
     *                                                      activityDescription:
     *                                                          type: string
     *                                                          example: An awesome combat sport that only allows for punches
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
  static async bookingXMLData(req, res) {
        try {
          const authenticationKey = req.headers["x-auth-key"]
          const user = await UserModel.getByAuthenticationKey(authenticationKey)
            let bookings =  await BookingModel.getByUserId(user.id)
            let userBookings = bookings.filter(booking => booking.sessionId.sessionDate < (new Date()))

            res.status(200).render("xml/bookings.xml.ejs", {userBookings})
        } catch (error) {
          console.log(error)
            res.status(500).json({
                message: "failed to export xml for member bookings"
            })
        }
  }

    /**
     * Handle exporting trainer sessions into XML
     * 
     * @type {express.RequestHandler}
     * @openapi
     * /api/sessions/sessionxml:
     *      get:
     *          summary: "Export and convert trainers upcoming sessions into XML"
     *          tags: [Sessions]
     *          security:
     *              - ApiKey: [] 
     *          responses:
     *              '200':
     *                  description: 'Exporting sessions successfully completed'
     *                  content:
     *                      text/xml:
     *                          schema:
     *                              type: array
     *                              xml:
     *                                  name: trainerSession
     *                              items:
     *                                  type: object
     *                                  properties:
     *                                      id: 
     *                                          type: string 
     *                                          example: 31 
     *                                      sessionDate: 
     *                                          type: string 
     *                                          format: date
     *                                      sessionTime: 
     *                                          type: string
     *                                          format: time
     *                                      trainerId: 
     *                                          type: string
     *                                          example: 81
     *                                      activity:
     *                                          type: object
     *                                          properties:
     *                                              activityId:
     *                                                  type: string
     *                                                  example: 3
     *                                              activityName:
     *                                                  type: string
     *                                                  example: Zumba
     *                                              activityDescription:
     *                                                  type: string
     *                                                  example: A funky dancing excercise 
     *                                      location: 
     *                                          type: object
     *                                          properties:
     *                                              activityId:
     *                                                  type: string
     *                                                  example: 5
     *                                              locationTitle:
     *                                                  type: string
     *                                                  example: Chermside High Street Gym
     *                                              locationAddress:
     *                                                  type: string
     *                                                  example: 53 Barnsley Street 
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
  static async sessionXMLData(req, res) {
        try {
            const authenticationKey = req.headers["x-auth-key"]
            const user = await UserModel.getByAuthenticationKey(authenticationKey)

            let allSessions = await SessionModel.getAll()
            allSessions.filter(session => session.trainerId.id == user.id)

            let trainerSessions = allSessions.filter(session => session.sessionDate > (new Date()))

            res.status(200).render("xml/trainerSessions.xml.ejs", {trainerSessions})
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "failed to export xml for upcoming sessions"
            })
        }
  }
}