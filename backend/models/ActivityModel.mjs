import { DatabaseModel } from "./DatabaseModel.mjs";

export class ActivityModel extends DatabaseModel {
 
// instance
constructor(id, activityName, activityDescription) {
  super()
  this.id = id,
  this.activityName = activityName,
  this.activityDescription = activityDescription
}

// static
  static tableToModel(row) {
    return new ActivityModel
    (
      row["ActivityID"],
      row["ActivityName"],
      row["ActivityDescription"],
    );
  }

  /**
   * gets list of all activities from the database.
   * @returns {Promise<Array<ActivityModel>>} list of all activities
   */
  static async getAll() {
    const results = await this.query("SELECT * FROM activities")
    return Promise.all(results.map((row) => this.tableToModel(row.activities)))
  }

  /**
   * gets activity by id
   * @param {number} id 
   * @returns {Promise<Array<ActivityModel>>} activity object
   */
  static async getById(id) {
    return this.query("SELECT * FROM activities WHERE ActivityID = ?", [id]).then(
      (result) =>
        result ? this.tableToModel(result[0].activities) : Promise.reject("not found")
    );
  }

    /**
   * gets activity by name
   * @param {string} activityName 
   * @returns {Promise<Array<ActivityModel>>} activity object
   */
    static async getByActivityName(activityName) {
    return this.query("SELECT * FROM activities WHERE ActivityName = ?", [
      activityName
    ]).then((result) =>
      result ? this.tableToModel(result[0].activities) : Promise.reject("not found")
    )
  }

  /**
   * @param {(ActivityModel|Object)} activity
   * @returns {Promise<mysql.OkPacket>}
   */
   static async create(activity) {
    return this.query(
      `
      INSERT INTO activities (ActivityName, ActivityDescription)
      VALUES (?, ?)
      `,
      [
        activity.activityName,
        activity.activityDescription,
      ]
    );
  }

  /**
   * @param {(ActivityModel|Object)} activity
   * @returns {Promise<mysql.OkPacket>}
   */
    static async update(activities) {
    return this.query(
      `
      UPDATE activities
      SET ActivityName = ?, ActivityDescription = ?
      WHERE ActivityID = ?
      `,
      [
        activities.activityName,
        activities.activityDescription,
        activities.id
      ]
    );
  }

  /**
   * @param {(number)} id
   * @returns {Promise<mysql.OkPacket>}
   */
  static async delete(id) {
    return this.query("DELETE FROM activities WHERE ActivityID = ?", [id]).then(
      (result) =>
        result.affectedRows > 0 ? result : Promise.reject("not found")
    );
  }
}
