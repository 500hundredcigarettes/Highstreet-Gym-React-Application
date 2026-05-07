import { DatabaseModel } from "./DatabaseModel.mjs"
import { UserModel } from "./UserModel.mjs"
import { SessionModel } from "./SessionModel.mjs"


export class BookingModel extends DatabaseModel {

  // instance
  constructor(id, sessionId, userId) {
    super()
    this.id = id
    this.sessionId = sessionId
    this.userId = userId
}

  // static
  static async tableToModel(row) {

    //retrieves and uses foreign key from mapped sql object.
    const [session, user] = await Promise.all([
      SessionModel.getById(row["SessionID"]),
      UserModel.getById(row["UserID"]),
    ]);
    
    return new BookingModel(
      row["BookingID"],
      session,
      user
    )
  }

  /**
   * gets list of all bookings from the database.
   * @returns {Promise<Array<BookingModel>>} list of all bookings
   */
  static async getAll() {
    const results = await this.query("SELECT * FROM bookings");
    return Promise.all(results.map(row => this.tableToModel(row.bookings)));
  }

  /**
   * gets booking by its id.
   * @param {number} id 
   * @returns {Promise<Array<BookingModel>>} booking object
   */
  static async getById(id) {
    return this.query("SELECT * FROM bookings WHERE BookingID = ?", [id]).then(
      (result) =>
        result ? this.tableToModel(result[0].bookings) : Promise.reject("not found")
    );
  }

  static async getByUserId(id) {
    const results = await this.query("SELECT * FROM bookings WHERE UserID = ?", [id])
    return Promise.all(results.map(row => this.tableToModel(row.bookings)));
  }

  /**
   * @param {number} sessionId 
   * @param {number} userId 
   * @returns {Promise<mysql.OkPacket>}
   */
  static async create(sessionId, userId) {
    return this.query(
      `
      INSERT INTO bookings (SessionID, UserID)
      VALUES (?, ?)
      `,
      [
        sessionId,
        userId
      ]
    )
  }

  /**
   * @param {(BookingModel|Object)} bookings
   * @returns {Promise<mysql.OkPacket>}
   */
  static async update(bookings) {
    return this.query(
      `
      UPDATE bookings
      SET SessionID = ?, UserID = ?
      WHERE BookingID = ?
      `,
      [
        bookings.sessionId,
        bookings.userId,
        bookings.id
      ]
    );
  }
  
  /**
   * @param {(number)} id
   * @returns {Promise<mysql.OkPacket>}
   */
  static async delete(id) {
    return this.query("DELETE FROM bookings WHERE BookingID = ?", [id]).then(
      (result) =>
        result.affectedRows > 0 ? result : Promise.reject("not found")
    );
  }
}
  