import express from "express"
import { APIAuthenticationController } from "./APIAuthenticationController.mjs"

export class APIUserController {
    static routes = express.Router()
    
    static {
        this.routes.get(
            "/self",
            this.getAuthenticatedUser
        )

        this.routes.get(
            "/pokemon",
            this.sendPokemon
        )
    }
    
    /**
     * Handle getting a user by their current authentication key header
     * 
     * @type {express.RequestHandler}
     * @openapi
     * /api/user/self:
     *      get:
     *          summary: "Get user by current authentication key header"
     *          tags: [Users]
     *          security:
     *              - ApiKey: [] 
     *          responses:
     *              '200':
     *                  description: 'User with provided authentication key'
     *                  content:
     *                      application/json:
     *                          schema:
     *                              $ref: "#/components/schemas/User"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async getAuthenticatedUser(req, res) {
        res.status(200).json(req.authenticatedUser)
    }

    /**
     * Handle getting an employee by their current authentication key header
     * 
     * @type {express.RequestHandler}
     * @openapi
     * /api/user/pokemon:
     *      get:
     *          summary: "Get some pokemon"
     *          tags: [Users]
     *          security:
     *              - ApiKey: [] 
     *          responses:
     *              '200':
     *                  description: 'User with provided with some fuckin pokemon'
     *                  content:
     *                      application/json:
     *                          schema:
     *                               $ref: "#/components/schemas/User"

     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async sendPokemon(req, res) {
        res.status(200).json({balls: 3, email: "fuckass email", password: "fucking password"})
    }
}