const bcrypt = require('bcrypt');
const User = require("../models/users.model.js");

exports.loginUser = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const { username, password } = req.body;

  User.getUserByUsername(username, (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Error occurred while retrieving the user.",
      });
      return;
    }

    if (user) {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.log(err);
          res.status(500).send({
            message: "Error occurred while comparing passwords.",
          });
          return;
        }

        if (isMatch) {
          req.session.user = user;
          console.log("Session after login:", req.session);  // Added log to check session
          res.json({
            message: "Login successful",
            user,
          });
        } else {
          res.status(401).send({
            message: "Invalid username or password",
          });
        }
      });
    } else {
      res.status(401).send({
        message: "Invalid username or password",
      });
    }
  });
};

exports.createUser = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const requestBody = req.body;

  User.createUser(requestBody, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Error occurred while creating the user.",
      });
      return;
    }

    res.json(data);
  });
};

exports.getUser = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const userId = req.params.id;

  User.getUserById(userId, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Error occurred while retrieving the user.",
      });
      return;
    }

    if (data) {
      res.json(data);
    } else {
      res.status(404).send({
        message: "User not found.",
      });
    }
  });
};

exports.updateUser = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const userId = req.params.id;
  const requestBody = req.body;

  User.updateUserById(userId, requestBody, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Error occurred while updating the user.",
      });
      return;
    }

    if (data) {
      res.json(data);
    } else {
      res.status(404).send({
        message: "User not found.",
      });
    }
  });
};

exports.deleteUser = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const userId = req.params.id;

  User.deleteUserById(userId, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Error occurred while deleting the user.",
      });
      return;
    }

    if (data.affectedRows == 0) {
      res.status(404).send({
        message: "User not found.",
      });
      return;
    }

    res.json({
      message: "User deleted successfully.",
    });
  });
};

exports.getAllUsers = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).send({ message: "Forbidden" });
  }

  User.getAllUsers((err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Error occurred while retrieving users.",
      });
      return;
    }

    // Exclude passwords from the response data
    const usersWithoutPasswords = data.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json(usersWithoutPasswords);
  });
};

