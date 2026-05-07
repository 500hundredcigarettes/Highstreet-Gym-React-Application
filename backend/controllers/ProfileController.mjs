import express from "express" 
import bcrypt from "bcryptjs"
import { LocationModel } from "../models/LocationModel.mjs"
import { UserModel } from "../models/UserModel.mjs"
import { AuthenticationController } from "./AuthenticateController.mjs"
/**
 * Controller for rendering profile view and 
 * handling CRUD functionalities for admin users
 * @class
 */
export class ProfileController {
  /** @type {express.Router} */
  static routes = express.Router()

  /**
   * Configures routes for profile endpoints.
   * @static
   */
  static {
    this.routes.get('/', this.renderProfile)
    this.routes.get('/:id', AuthenticationController.restrict(["Admin"]), this.renderProfileAdmin)

    this.routes.post('/:id', AuthenticationController.restrict(["Admin"]), this.handleProfileEdits)
  }

  /**
   * Renders the profile view for the current user
   * @param {express.Request} req - id of the logged in user.
   * @param {express.Response} res - Renders view for the profile for non-admin users.
   */
  static async renderProfile(req, res) {
      let user = await UserModel.getById(req.session.savedUserId) ?? 'Guest'
      res.render('profile.ejs', { user, selectedUser: null })
  }

  /**
   * Renders the admin profile view for the current admin.
   * or view for the profile the admin is editing
   * @param {express.Request} req - id of the logged in user.
   * @param {express.Response} res - Renders view for admin's own profile or another user's profile.
   */
  static async renderProfileAdmin(req, res) {
      let gyms = await LocationModel.getAll(location => location)
      let user = await UserModel.getById(req.session.savedUserId)
      let selectedUser = await UserModel.getById(req.params.id)
      if (selectedUser == undefined) {
        let selectedUser = 'Guest'
      } 
        res.render('profile.ejs', {selectedUser, user, gyms})
    }
  
  /**
   * Handles profile updating or deleting operations (Deleting user and editing existing user details)
   * @param {express.Request} req - id of the selected user being edited.
   * @param {express.Response} res - sends error or success statuses based on the outcome of an CRUD action.
   */
static async handleProfileEdits(req, res) {
    const selectedUserId = req.params.id;
    const selectedUser = await UserModel.getById(selectedUserId)
    let formData = req.body
    const action = formData.action
    console.log(formData.password)
    const user = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      password: formData.password === "" ? selectedUser.password : bcrypt.hashSync(formData.password),
      address: formData.address,
      gymId: parseInt(formData.gym),
      phoneNumber: formData.phoneNumber,
      id: selectedUserId
    }

    console.log(user.password)

    if (action == "update") {
      UserModel.update(user)
        .then((result) => {
          if (result.affectedRows > 0) {
            return
          } else {
            res.status(500).render("error_status.ejs", {
              status: "user update error",
              message: "The user could not be found.",
              redirect: "admin",
              redirectMessage: "Return to admin page"
            });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).render("error_status.ejs", {
            status: "Database error",
            message: "The user could not be updated.",
            redirect: `profile/${user.id}`,
            redirectMessage: "Return to admin page"
          });
        });
    } else if (action == "delete") {
      UserModel.delete(user.id)
        .then((result) => {
          if (result.affectedRows > 0) {
            return
          } else {
            res.status(500).render("error_status.ejs", {
              status: "User delete error",
              message: "The user could not be deleted.",
              redirect: `profile/${user.id}`,
              redirectMessage: "Return to admin page"
            });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).render("error_status.ejs", {
            status: "Database error",
            message: "The user could not be deleted.",
            redirect: "admin",
            redirectMessage: "Return to admin page"
          });
        });
    } else {
      res.status(500).render("error_status.ejs", {
        status: "Invalid action",
        message: "The form doesn't support this action",
        redirect: "admin",
        redirectMessage: "Return to admin page"
      });
    }
  }
}