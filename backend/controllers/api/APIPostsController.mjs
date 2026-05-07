import express from "express"
import { SessionModel } from "../../models/SessionModel.mjs"
import { ActivityModel } from "../../models/ActivityModel.mjs"
import { LocationModel } from "../../models/LocationModel.mjs"
import { BookingModel } from "../../models/BookingModel.mjs"
import { UserModel } from "../../models/UserModel.mjs"
import { PostModel } from "../../models/PostModel.mjs"
import { APIAuthenticationController } from "./APIAuthenticationController.mjs"

export class APIPostsController {
  static routes = express.Router()

  static {
    this.routes.get("/", this.getAllPosts)
    this.routes.post("/create", this.confirmPosts)
    this.routes.delete("/delete", this.deletePost)
  }


    /**
     * Gets all the posts data and sends it to the client
     * 
     * @type {express.RequestHandler}
     * @openapi
     * /api/posts:
     *   get:
     *     summary: "Send all posts from database"
     *     tags: [Posts]
     *     responses:
     *       '200':
     *         description: 'Post data sent successfully'
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Posts"            
     *       default:
     *         $ref: "#/components/responses/Error"
     */
  static async getAllPosts(req, res) {
    const posts = await PostModel.getAll()
    res.status(200).json(posts)
  }

    /**
     * Gets all the posts data and sends it to the client
     * 
     * @type {express.RequestHandler}
     * @openapi
     * /api/posts/create:
     *   post:
     *     summary: "Creates a new post with the provided content"
     *     tags: [Posts]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/Posts"
     *     responses:
     *       '200':
     *         description: 'Post created successfully'
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Posts"            
     *       '500':
     *         $ref: "#/components/responses/Error"
     */
  static async confirmPosts(req, res) {
    const userId = req.body.id;
    const postContent = req.body.content
    
    if (userId == null | undefined) {
      res.status(500).json({
        message:"You must register an account and be logged in to be able to post on the microblog"
      }) 
    } else {
      PostModel.create(postContent, userId).then((result) => {
            res.status(200).json({
                message: "Post successfully created"
            })
        });
      }
    }

  /**
   *
   * @type {express.RequestHandler}
   * @openapi
   * /api/posts/delete:
   *   delete:
   *     summary: "Deletes a post that a user has created themselves" 
   *     tags: [Posts]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/Posts"
   *     responses:
   *       '200':
   *         $ref: "#/components/responses/Updated"
   *       default:
   *         $ref: "#/components/responses/Error"
   */
  static async deletePost(req, res) {
    PostModel.delete(req.body.postId)
    res.status(200).json({
      message: "Post deleted successfully"
    });
  }
}