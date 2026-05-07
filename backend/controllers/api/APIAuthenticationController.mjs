import express from "express";
import { UserModel } from "../../models/UserModel.mjs";
import { LocationModel } from "../../models/LocationModel.mjs";
import bcrypt from "bcryptjs";

export class APIAuthenticationController {
  static middleware = express.Router();
  static routes = express.Router();

  static {
    this.middleware.use(this.#APIAuthenticationProvider);
    this.routes.post("/authenticate", this.handleAuthenticate);
    this.routes.post("/signup", this.handleSignUp);
    this.routes.post("/update", this.handleProfileUpdates);
    
    this.routes.delete("/authenticate", this.handleAuthenticate);
  }
  
  
  /**
   *
   * @private
   * @type {express.RequestHandler}
   */
  static async #APIAuthenticationProvider(req, res, next) {
    const authenticationKey = req.headers["x-auth-key"];
    if (authenticationKey) {
      try {
        req.authenticatedUser = await UserModel.getByAuthenticationKey(
          authenticationKey
        );
      } catch (error) {
        if (error == "not found") {
          res.status(404).json({
            message: "Failed to authenticate - key not found",
          });
        } else {
          console.error(error);
          res.status(500).json({
            message: "Failed to authenticate - database error",
          });
        }
        return;
      }
    }
    next();
  }

  /**
   *
   * @type {express.RequestHandler}
   * @openapi
   * /api/authenticate:
   *     post:
   *        summary: "Authenticate account with email and password when user logs in"
   *        tags: [Authentication]
   *        requestBody:
   *            required: true
   *            content:
   *                application/json:
   *                    schema:
   *                        $ref: "#/components/schemas/User"
   *        responses:
   *            '200':
   *                $ref: "#/components/responses/LoginSuccessful"
   *            '400':
   *                $ref: "#/components/responses/Error"
   *            '500':
   *                $ref: "#/components/responses/Error"
   *     delete:
   *        summary: "When user logs out deauthenticate account by deleting API key header" 
   *        tags: [Authentication]
   *        security:
   *            - ApiKey: []
   *        responses:
   *            '200':
   *                $ref: "#/components/responses/Updated"
   *            default:
   *                $ref: "#/components/responses/Error"
   */

  static async handleAuthenticate(req, res) {
    if (req.method == "POST") {
      try {
        const checkUser = await UserModel.getByEmail(req.body.email);

        if (await bcrypt.compare(req.body.password, checkUser.password)) {
          const authenticationKey = crypto.randomUUID();
          checkUser.authenticationKey = authenticationKey;
              const user = {
                firstName: checkUser.firstName,
                lastName: checkUser.lastName,
                role: checkUser.role,
                password: bcrypt.hashSync(checkUser.password),
                address: checkUser.address,
                gymId: checkUser.gymId.id,
                phoneNumber: checkUser.phoneNumber,
                authenticationKey: checkUser.authenticationKey,
                id: checkUser.id
              }
          await UserModel.update(user);

          res.status(200).json({
            key: authenticationKey,
          });
        } else {
          res.status(400).json({
            message: "Invalid credentials",
          });
        }
      } catch (error) {
        switch (error) {
          case "not found":
            res.status(400).json({
              message: "Invalid credentials",
            });
            break;
          default:
            console.error(error);
            res.status(500).json({
              message: "Failed to authenticate user, this email may not be registered",
            });
            break;
        }
      }
    } else if (req.method == "DELETE") {
      if (req.authenticatedUser) {
        const checkUser = await UserModel.getByAuthenticationKey(
          req.authenticatedUser.authenticationKey
        )

          const user = {
            firstName: checkUser.firstName,
            lastName: checkUser.lastName,
            role: checkUser.role,
            password: checkUser.password,
            address: checkUser.address,
            gymId: checkUser.gymId.id,
            phoneNumber: checkUser.phoneNumber,
            authenticationKey: null,
            id: checkUser.id
          }
          
        await UserModel.update(user);

        res.status(200).json({
          message: "Deauthentication successful",
        });
      } else {
        res.status(401).json({
          message: "Please login to access the requested resources",
        });
      }
    }
  }

  /**
   *
   * @type {express.RequestHandler}
   * @openapi
   * /api/signup:
   *     post:
   *        summary: "Create new account with provided data"
   *        tags: [Signup]
   *        requestBody:
   *            required: true
   *            content:
   *                application/json:
   *                    schema:
   *                        $ref: "#/components/schemas/User"
   *        responses: 
   *            '200':
   *                $ref: "#/components/responses/SignupSuccessful"
   *            '400':
   *                $ref: "#/components/responses/Error"
   *            '500':
   *                $ref: "#/components/responses/Error"
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
        res.status(200).json({
          message: "Account successfully created"
        })
      } else {
        res.status(502).json({
          message: "An account is already registered with the submitted email"
        })
      }
    }

  /**
   *
   * @type {express.RequestHandler}
   * @openapi
   * /api/update:
   *     post:
   *        summary: "Update existing account with provided data"
   *        tags: [Update]
   *        security:
   *            - ApiKey: []
   *        requestBody:
   *            required: true
   *            content:
   *                application/json:
   *                    schema:
   *                        $ref: "#/components/schemas/User"
   *        responses: 
   *            '200':
   *                $ref: "#/components/responses/Updated"
   *            '400':
   *                $ref: "#/components/responses/Error"
   *            '500':
   *                $ref: "#/components/responses/Error"
   */
  static async handleProfileUpdates(req, res) {
        const userId = req.body.id;
        const checkUser = await UserModel.getById(userId) 
        let updateDetails = req.body
        let getGym = await LocationModel.getByLocationTitle(updateDetails.gym)
        console.log(getGym)
        const user = {
          firstName: updateDetails.firstName,
          lastName: updateDetails.lastName,
          role: checkUser.role,
          password: updateDetails.password === "" ? checkUser.password : bcrypt.hashSync(updateDetails.password),
          address: updateDetails.address,
          gymId: parseInt(getGym.id),
          phoneNumber: updateDetails.phoneNumber,
          authenticationKey: checkUser.authenticationKey,
          id: userId
        }
    
          UserModel.update(user).then((result) => {
              if (result.affectedRows > 0) {
                res.status(200).json({
                  message: "Account successfully updated"
                })
              } else {
                res.status(500).json({
                  message: "The user could not be found.",
                });
              }
            })
            .catch((error) => {
              console.error(error);
              res.status(500).json({
                message: "The user could not be updated.",
              });
            });
  }

  /**
   * Allows us to deine restricted routes.
   * @param {Array<"Admin"|"Trainer"|"Member"> | "any"} allowedRoles
   * @returns {express.RequestHandler}
   */
  static restrict(allowedRoles) {
    return function (req, res, next) {
      if (req.authenticatedUser) {
        if (allowedRoles.includes(req.authenticatedUser.role)) {
          next();
        } else {
          res.status(403).json({
            message: "Access forbidden",
            errors: ["Role does not have access to the requested resource"],
          });
        }
      } else {
        res.status(401).json({
          message: "waggan pussy clart",
          errors: ["Please authenticate to access the requested resource"],
        });
      }
    };
  }
}
