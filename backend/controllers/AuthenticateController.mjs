import express from "express"
import session from "express-session"
import bcrypt from "bcryptjs"
import { LocationModel } from "../models/LocationModel.mjs"
import { UserModel } from "../models/UserModel.mjs"
/**
 * Controller for handling user authentication, including login, signup, logout,
 * and role-based access control.
 * @class
 */
export class AuthenticationController {
  /** @type {express.Router} */  
  static middleware = express.Router();
  /** @type {express.Router} */
  static routes = express.Router()

  /**
   * Configures middleware and authentication related endpoints.
   * @static
   */
  static {
    this.middleware.use(
      session({
        secret: "f27e0c1d-03eb-4289-8422-2eae2f3eee28",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: "auto" },
      })
    );
    this.middleware.use(this.#session_authentication);

    this.routes.get("/", this.viewAuthenticate)
    this.routes.get("/logout", this.handleDeauthenticate)
    this.routes.get("/signup", this.viewSignup)

    this.routes.post("/", this.handleAuthenticate)
    this.routes.post("/signup", this.handleSignUp)
  }

  /**
   * middleware to authenticate users based on session data.
   * attaches the authenticated user to the request object if a valid session exists.
   * @private
   * @param {express.Request} req - if an authenticatedUser is not found, the logged in user will then be registered as an authenticatedUser.
   * @param {express.NextFunction} next - Proceeds to route handlers once user is authenticated.
   */
  static async #session_authentication(req, res, next) {
    if (req.session.savedUserId && !req.autheticatedUser) {
      try {
        req.authenticatedUser = await UserModel.getById(req.session.savedUserId);
      } catch (error) {
        console.error(error);
      }
    }
    next();
  }

  /**
   * Implements getting the login page with a form that allows 
   * the user to enter their username and password.
   * @param {express.Response} res - renders initial view for the log-in page
   */
  static viewAuthenticate(req, res) {
    let user = 'Guest'
    res.render("login.ejs", {user})
  }

  /**
   * Handles user authentication by validating credentials and redirecting based on user role.
   * @param {express.Request} req - request object containing email and password in the body.
   * @param {express.Response} res - redirects user or responds with an 
   * error status that the user has failed authentication.
   */
  static async handleAuthenticate(req, res) {
    const contentType = req.get("Content-Type")
    const email = req.body.email
    const password = req.body.password
    if (contentType == "application/x-www-form-urlencoded") {
      try {
        const user = await UserModel.getByEmail(email)
        const isCorrectPassword = await bcrypt.compare(
          password,
          user.password
        );

        if (isCorrectPassword) {
          req.session.savedUserId = user.id;
          if (user.role == "Admin") {
            res.redirect(`/admin`);
          } else {
            res.redirect('/sessions')
          }

        } else {
          res.status(400).render("error_status.ejs", {
            status: "Login failed",
            message: "Incorrect password",
            redirect: "authenticate",
            redirectMessage: "Redirect to login page"
          })
        }
      } catch (error) {
        if (error == "not found") {
          res.status(400).render("error_status.ejs", {
            status: "Login failed",
            message: "User not found",
            redirect: "authenticate",
            redirectMessage: "Redirect to login page"
          });
        } else {
          res.status(500).render("error_status.ejs", {
            status: "Invalid Credentials",
            message: "Authentication failed",
            redirect: "authenticate",
            redirectMessage: "Redirect to login page"
          });
        }
      }
    } else if (contentType == "application/json") {

    } else {
        res.status(400).render("error_status.ejs", {
        status: "Authenticate failed.",
        message: "Invalid authentication request body",
        redirect: "authenticate",
        redirectMessage: "Redirect to login page"
      });
    }
  }

  /**
   * Renders the signup page with a list of available gyms.
   * @param {express.Response} res - renders initial signup page.
   */
  static viewSignup(req, res) {
    LocationModel.getAll().then((gyms) => {
      res.render('signup.ejs', {gyms}) 
    })
  }
  
  /**
   * Handles user signup by creating a new user with hashed password and redirecting on failure.
   * @param {express.Request} req - request object containing user data in the body.
   * @param {express.Response} res - error redirection if an account is already registered with a submitted email.
   */
  static async handleSignUp(req, res) {
    let formData = req.body
    const emailCheck = await UserModel.getByEmail(formData.email) 

    let gymId = await LocationModel.getByLocationTitle(formData.gym)
      const user = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'Member',
        password: formData.password,
        email: formData.email,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        gymId: gymId.id
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
   * Handles user logout by destroying the session and rendering a confirmation message.
   * @param {express.Request} req - contains authenticatedUser data and session data.
   * @param {express.Response} res - responds with success or error message when attempting to logout.
   */
  static handleDeauthenticate(req, res) {
    if (req.authenticatedUser && req.authenticatedUser.id == req.session.savedUserId) {
        req.session.destroy();
        res.status(200).render("error_status.ejs", {
          status: "Logged out",
          message: "You have been logged out",
          redirect: "authenticate",
          redirectMessage: "Redirect to login page"

        });
    } else {
      res.status(401).render("error_status.ejs", {
        status: "Unauthenticated",
        message: "Please login to access the requested resource.",
        redirect: "authenticate",
        redirectMessage: "Redirect to login page"
      })
    }
  }

  /**
   * middleware to restrict access to routes based on user roles.
   * @static
   * @param {string[]} allowedRoles - array of roles allowed to access the route.
   * @returns {express.RequestHandler} middleware function to check user role.
   */
  static restrict(allowedRoles) {
      return function (req, res, next) {
          if (req.authenticatedUser) {
              if (allowedRoles.includes(req.authenticatedUser.role)) {
                  next()
              } else {
                  res.status(403).render("error_status.ejs", {
                      status: "Access Forbidden",
                      message: "Role does not have access to the requested resource.",
                      redirect: "authenticate",
                      redirectMessage: "Redirect to login page"
                  })
              }
          } else {
              res.status(401).render("error_status.ejs", {
                  status: "Unauthenticated",
                  message: "Please login to access the requested resource.",
                  redirect: "authenticate",
                  redirectMessage: "Redirect to login page"
              })
          }
      }
  }
}
