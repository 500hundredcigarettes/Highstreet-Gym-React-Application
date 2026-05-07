import { DatabaseModel } from "./DatabaseModel.mjs"

export class LocationModel extends DatabaseModel {

  // instance
  constructor(id, locationTitle, locationAddress) {
    super()
    this.id = id
    this.locationTitle = locationTitle,
    this.locationAddress = locationAddress
  }

  // stance
    static tableToModel(row) {
    return new LocationModel
    (
      row["LocationID"],
      row["LocationTitle"],
      row["LocationAddress"],
    );
  }

  /**
   * gets list of all locations from the database.
   * @returns {Promise<Array<LocationModel>>} list of all locations
   */
  static async getAll() {
    const results = await this.query("SELECT * FROM locations")
    return Promise.all(results.map((row) => this.tableToModel(row.locations)))
  }

  /**
   * get location by its id
   * @param {number} id 
   * @returns {Promise<Array<LocationModel>>} location object
   */
    static async getById(id) {
    return this.query("SELECT * FROM locations WHERE LocationID = ?", [id]).then(
    (result) => result.length === 0 ? console.log('user is a guest') :
    result ? this.tableToModel(result[0].locations) : Promise.reject("not found")
    );
  }

  /**
   * gets location by its title.
   * @param {string} locationTitle 
   * @returns {Promise<Array<LocationModel>>} location object
   */
    static async getByLocationTitle(locationTitle) {
    return this.query("SELECT * FROM locations WHERE LocationTitle = ?", [
      locationTitle
    ]).then((result) =>
      result ? this.tableToModel(result[0].locations) : Promise.reject("not found")
    )
  }

  /**
   * @param {(LocationModel|Object)} location
   * @returns {Promise<mysql.OkPacket>}
   */
  static async create(location) {
    return this.query(
      `
      INSERT INTO locations (LocationTitle, LocationAddress)
      VALUES (?, ?)
      `,
      [
        location.locationTitle, 
        location.locationAddress
      ]
    );
  }

  /**
   * @param {(LocationModel|Object)} location
   * @returns {Promise<mysql.OkPacket>}
   */
    static async update(locations) {
    return this.query(
      `
      UPDATE locations
      SET LocationTitle = ?, LocationAddress = ?
      WHERE LocationID = ?
      `,
      [
        locations.locationTitle,
        locations.locationAddress,
        locations.id
      ]
    );
  }

  
  /**
   * @param {number} id
   * @returns {Promise<mysql.OkPacket>}
   */
  static async delete(id) {
    return this.query("DELETE FROM locations WHERE LocationID = ?", [id]).then(
      (result) =>
        result.affectedRows > 0 ? result : Promise.reject("not found")
    );
  }
}

