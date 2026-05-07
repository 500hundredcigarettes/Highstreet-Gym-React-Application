import express from "express"
import { PostModel } from "../models/PostModel.mjs"
import { UserModel } from "../models/UserModel.mjs"
import { AuthenticationController } from "./AuthenticateController.mjs"

/**
 * Controller for rendering post views
 * and handling CRUD functionalities for admin users
 * @class
 */
export class PostController {
  /** @type {express.Router} */
  static routes = express.Router()

  /**
   * Configures routes for post endpoints.
   * @static
   */
  static {
    this.routes.get("/", this.viewPosts)
    this.routes.get("/:userId", AuthenticationController.restrict(["Admin"]), this.viewPosts)


    this.routes.post("/", this.confirmPosts)
    this.routes.post("/delete", this.deletePost)
    this.routes.post("/edit", this.editPost)
    this.routes.post("/:userId", AuthenticationController.restrict(['Admin']), this.confirmPostForUser)

  }

  /**
   * Renders the blog view for the current user
   * @param {express.Request} req - id of the logged in user.
   * @param {express.Response} res - Renders the initial blog view including 
   * options to delete a logged in user's own posts.
   */
  static async viewPosts(req, res) {
    let user = await UserModel.getById(req.session.savedUserId) ?? 'Guest'
    let allPosts = await PostModel.getAll().then(posts => posts)
    let selectedUser = await UserModel.getById(req.params.userId) ?? new UserModel(null, "", "", "", "", "", "", "", "")
    if (selectedUser.id) {
      let posts = allPosts.filter(post => post.userId.id == selectedUser.id)
      res.render('posts.ejs', {posts, user, selectedUser})
    } else { 
      let posts = await PostModel.getAll().then(posts => posts)
      res.render('posts.ejs', {posts, user, selectedUser})
    }
  }

  /**
   * Handles the creation of a new blog post
   * @param {express.Request} req - text content of the post and id of the logged in user.
   * @param {express.Response} res - error status for guest users if they attempt to create a post.
   */
  static async confirmPosts(req, res) {
    let postContent = req.body.content
    let savedUserId = req.session.savedUserId
    
    if (savedUserId == null | undefined) {
      res.render('error_status.ejs', {
        status:"User not logged into account",
        message:"You must register an account and be logged in to be able to post on the microblog",
        redirect: "authenticate",
        redirectMessage: "Redirect to login page"
      }) 
    } else {
      PostModel.create(postContent, savedUserId)
    }
  }

  static async confirmPostForUser(req, res) {
    let postContent = req.body.content
    let selectedUserId = req.params.userId
    PostModel.create(postContent, selectedUserId)
  }

  /**
   * Handles the editing of an existing post
   * @param {express.Request} req - post id and text content of the existing post.
   */
  static editPost(req, res) {
    let editedPost = {
      postContent: req.body.content,
      id: parseInt(req.body.postId)
    }
    PostModel.update(editedPost)
  }

  
  /**
   * Handles the deletion of an existing post
   * @param {express.Request} req - post id of the existing post.
   */
  static deletePost(req, res) {
    PostModel.delete(req.body.deleteId)
  }
}