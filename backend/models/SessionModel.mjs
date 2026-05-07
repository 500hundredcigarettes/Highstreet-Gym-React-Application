import { DatabaseModel } from "./DatabaseModel.mjs"
import { UserModel } from "./UserModel.mjs"
import { LocationModel } from "./LocationModel.mjs"
import { ActivityModel } from "./ActivityModel.mjs"

export class SessionModel extends DatabaseModel {

  // instance
  constructor(id, sessionDate, sessionTime, activityId, trainerId, locationId) {
    super()
    this.id = id
    this.sessionDate = sessionDate
    this.sessionTime = sessionTime
    this.activityId = activityId
    this.trainerId = trainerId
    this.locationId = locationId
  }

  // static
  static async tableToModel(row) {
      
    //retrieves and uses foreign key from mapped sql object.
      const [activity, trainer, location] = await Promise.all([
      ActivityModel.getById(row["ActivityID"]),
      UserModel.getById(row["TrainerID"]),
      LocationModel.getById(row["LocationID"])
    ]);
    
    return new SessionModel(
      row["SessionID"],
      row["SessionDate"],
      row["SessionTime"],
      activity,
      trainer,
      location
    );
  }

  /**
   * gets list of all sessions from the database.
   * @returns {Promise<Array<SessionModel>>} list of all sessions
   */
  static async getAll() {
    const results = await this.query("SELECT * FROM sessions")
    return Promise.all(results.map(row => this.tableToModel(row.sessions)))
  }


  /**
   * @param {object} startDate 
   * @param {object} endDate 
   * @returns {Promise<Array<SessionModel>>} session object
   */
  static async getByDateRange(startDate, endDate) {
    const results = await this.query("SELECT * FROM sessions WHERE SessionDate BETWEEN ? AND ?", [startDate, endDate])
    return Promise.all(results.map(row => this.tableToModel(row.sessions)));
  }

  static async getBefore(date) {
    const results = await this.query("SELECT * FROM sessions where SessionDate < ?", [date])
    return Promise.all(results.map(row => this.tableToModel(row.sessions)));
  }

  static async getAfter(date) {
    const results = await this.query("SELECT * FROM sessions where SessionDate > ?", [date])
    return Promise.all(results.map(row => this.tableToModel(row.sessions)));
  }

  /**
   * gets session by its id.
   * @param {number} id 
   * @returns {Promise<Array<SessionModel>>} session object
   */
  static async getById(id) {
    return this.query("SELECT * FROM sessions WHERE SessionID = ?", [id]).then(
      (result) =>
        result ? this.tableToModel(result[0].sessions) : Promise.reject("not found")
    );
  }

  /**
   * @param {object} sessionDate 
   * @returns {Promise<Array<SessionModel>>} session object
   */
  static async getBySessionDate(sessionDate) {
    return this.query("SELECT * FROM sessions WHERE SessionDate = ?", [
      sessionDate
    ]).then((result) =>
      result ? this.tableToModel(result[0].sessions) : Promise.reject("not found")
    );
  }

  /**
   * @param {(SessionModel|Object)} sessions
   * @returns {Promise<mysql.OkPacket>}
   */
  static async create(sessions) {
    return this.query(
      `
      INSERT INTO sessions (SessionDate, SessionTime, ActivityID, TrainerID, LocationID)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        sessions.sessionDate,
        sessions.sessionTime,
        sessions.activityId,
        sessions.trainerId,
        sessions.locationId
      ]
    )

  }
  /**
   * @param {(SessionModel|Object)} sessions
   * @returns {Promise<mysql.OkPacket>}
   */
  static async update(sessions) {
    return this.query(
      `
      UPDATE sessions
      SET SessionDate = ?, SessionTime = ?, ActivityID = ?, TrainerID = ?, LocationID = ?
      WHERE SessionID = ?
      `,
      [
        sessions.sessionDate,
        sessions.sessionTime,
        sessions.activityId,
        sessions.trainerId,
        sessions.locationId,
        sessions.id
      ]
    );
  }
  /**
   * @param {(number)} id
   * @returns {Promise<mysql.OkPacket>}
   */
  static async delete(id) {
    return this.query("DELETE FROM sessions WHERE SessionID = ?", [id]).then(
      (result) =>
        result.affectedRows > 0 ? result : Promise.reject("not found")
    );
  }

}