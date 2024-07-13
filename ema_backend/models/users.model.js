const sql = require('../utils/db.utils.js');
const bcrypt = require('bcrypt');

// Constructor
const User = function(user) {
  this.username = user.username;
  this.password = user.password;
  this.category_id = user.category_id;
  this.vendor_id = user.vendor_id;
};

// Create a new User
User.createUser = (newUser, result) => {
  bcrypt.hash(newUser.password, 10, (err, hash) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    newUser.password = hash;

    sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created user: ", { id: res.insertId, ...newUser });
      result(null, { id: res.insertId, ...newUser });
    });
  });
};

// Retrieve a user by ID
User.getUserById = (userId, result) => {
  sql.query("SELECT * FROM users WHERE id = ?", [userId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // User not found
    result({ kind: "not_found" }, null);
  });
};

// Retrieve a user by username
User.getUserByUsername = (username, result) => {
  sql.query("SELECT * FROM users WHERE username = ?", [username], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // User not found
    result({ kind: "not_found" }, null);
  });
};

// Update a user by ID
User.updateUserById = (id, user, result) => {
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    user.password = hash;

    sql.query(
      "UPDATE users SET username = ?, password = ?, category_id = ?, vendor_id = ? WHERE id = ?",
      [user.username, user.password, user.category_id, user.vendor_id, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // User not found
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("updated user: ", { id: id, ...user });
        result(null, { id: id, ...user });
      }
    );
  });
};

// Delete a user by ID
User.deleteUserById = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

// Retrieve all users
User.getAllUsers = (result) => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

module.exports = User;
