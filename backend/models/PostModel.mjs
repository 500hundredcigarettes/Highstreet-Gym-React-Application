import { DatabaseModel } from "./DatabaseModel.mjs"
import { UserModel } from "./UserModel.mjs";


export class PostModel extends DatabaseModel {
  // instance
  constructor(id, postContent, userId) {
    super();
    this.id = id 
    this.postContent = postContent
    this.userId = userId
  }

  // static
  static async tableToModel(row) {

    //retrieves and uses foreign key from mapped sql object.
    const [user] = await Promise.all([
      UserModel.getById(row["UserID"]),
    ])
  
    return new PostModel(
      row["PostID"],
      row["PostContent"], 
      user
    );
  }

  /**
   * gets list of all posts from the database.
   * @returns {Promise<Array<PostModel>>} list of all posts
   */
    static async getAll() {
    const results = await this.query("SELECT * FROM posts");
    return Promise.all(results.map(row => this.tableToModel(row.posts)))
  }

  /**
   * gets posts by its id.
   * @param {number} id 
   * @returns {Promise<Array<PostModel>>} post object
   */
    static async getById(id) {
    return this.query("SELECT * FROM posts WHERE UserID = ?", [id]).then(
      (result) =>
        result ? this.tableToModel(result[0].posts) : Promise.reject("not found")
    );
  }

  /**
   * @param {string} postContent 
   * @param {number} userId 
   * @returns {Promise<mysql.OkPacket>}
   */
    static async create(postContent, userId) {
    return this.query(
      `
      INSERT INTO posts (PostContent, UserID)
      VALUES (?, ?)
      `,
      [
        postContent, 
        userId
      ]
    );
  }

  /**
   * @param {string} postContent 
   * @param {number} userId 
   * @returns {Promise<mysql.OkPacket>}
   */
    static async update(posts) {
    return this.query(
      `
      UPDATE posts
      SET PostContent = ?
      WHERE PostID = ?
      `,
      [
        posts.postContent,
        posts.id
      ]
    );
  }

  /**
   * @param {number} id 
   * @returns {Promise<mysql.OkPacket>}
   */
    static async delete(id) {
    return this.query("DELETE FROM posts WHERE PostID = ?", [id]).then(
      (result) =>
        result.affectedRows > 0 ? result : Promise.reject("not found")
    );
  }

}
