import { DatabaseModel } from "./DatabaseModel.mjs";
import { LocationModel } from "./LocationModel.mjs";

export class UserModel extends DatabaseModel {

  // Instance
  constructor(id, firstName, lastName, role, password, email, address, gymId, phoneNumber, authenticationKey) {
    super();
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.role = role
    this.password = password
    this.email = email 
    this.address = address
    this.gymId = gymId
    this.phoneNumber = phoneNumber
    this.authenticationKey = authenticationKey;
  }

  //used to convert an sql table row into a model object,
  //it maps the database fields to the javascript model fields
    static async tableToModel(row) {
    //retrieves and uses foreign key from mapped sql object.
    const [gym] = await Promise.all([LocationModel.getById(row["GymID"])]) 

    return new UserModel
    (
      row["UserID"],
      row["FirstName"],
      row["LastName"],
      row["UserRole"],
      row['Password'],
      row['Email'],
      row['Address'],
      gym,
      row['PhoneNumber'],
      row['AuthenticationKey']
    )
  }

  /**
   * gets list of all users from the database.
   * @returns {Promise<Array<UserModel>>} list of all users
   */
    static async getAll() {
    const results = await this.query("SELECT * FROM users");
    return Promise.all(results.map(row => this.tableToModel(row.users)))
  }

  /**
   * gets user by their id.
   * @param {number} id 
   * @returns {Promise<Array<UserModel>>} user object
   */
    static async getById(id) {
    return this.query("SELECT * FROM users WHERE UserID = ?", [id]).then(
    (result) =>  result.length === 0 ? console.log('user is a guest') :
    result ? this.tableToModel(result[0].users) : Promise.reject("not found")
  )}

  /**
   * gets user by their email.
   * @param {string} email 
   * @returns {Promise<Array<UserModel>>} user object
   */

    static async getByEmail(email) {
    return this.query("SELECT * FROM users WHERE Email = ?", [
      email
    ]).then((result) =>
      result.length === 0 ? console.log('user is a guest') :
    result ? this.tableToModel(result[0].users) : Promise.reject("not found")
    )
  }

  /**
   * users that are trainers.
   * @returns {Promise<Array<UserModel>>} list of trainers
   */
  static async getTrainers() {
    const results = await this.query("SELECT * FROM users WHERE UserRole = 'Trainer'")
    return Promise.all(results.map(row => this.tableToModel(row.users)))
  }

  static getByAuthenticationKey(authenticationKey) {
        return this.query("SELECT * FROM users WHERE AuthenticationKey = ? AND Deleted = 0", [authenticationKey])
            .then(result =>
                result.length > 0
                    ? this.tableToModel(result[0].users)
                    : Promise.reject("not found")
            )
    }

  /**
   * @param {(UserModel|Object)} user
   * @returns {Promise<mysql.OkPacket>}
   */
    static async create(user) {
    return this.query(
      `
      INSERT INTO users (FirstName, LastName, UserRole, Password, Email, Address, GymID, PhoneNumber)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user.firstName,
        user.lastName,
        user.role,
        user.password,
        user.email,
        user.address,
        user.gymId,
        user.phoneNumber,
      ]
    );
  }

   /**
   * @param {(UserModel|Object)} users
   * @returns {Promise<mysql.OkPacket>}
   */
    static async update(users) {
    return this.query(
      `
      UPDATE users
      SET FirstName = ?, LastName = ?, UserRole = ?, Address = ?, GymID = ?, PhoneNumber = ?, AuthenticationKey = ?
      WHERE UserID = ?
      `,
      [
        users.firstName,
        users.lastName,
        users.role,
        users.address,
        users.gymId,
        users.phoneNumber,
        users.authenticationKey,
        users.id
      ]
    );
  }

   /**
   * @param {number} id
   * @returns {Promise<mysql.OkPacket>}
   */
  //   static async delete(id) {
  //   return this.query("DELETE FROM users WHERE UserID = ?", [id]).then(
  //     (result) =>
  //       result.affectedRows > 0 ? result : Promise.reject("not found")
  //   );
  // }


    static async delete(id) {
    return this.query("UPDATE users SET deleted = 1 WHERE id = ?", [
      id,
    ]).then((result) =>
      result.affectedRows > 0 ? result : Promise.reject("not found")
    );
  }

}
