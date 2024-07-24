const authMiddleware = require("../middleware/auth.middleware.js");
const users = require("../controllers/users.controller.js");

module.exports = (app) => {
  app.post("/login", users.loginUser);

  app.post("/users", users.createUser);

  app.get("/users/:id", users.getUser);

  app.put("/users/:id", users.updateUser);

  app.delete("/users/:id", users.deleteUser);
  
  app.get("/users", authMiddleware.ensureAdmin, users.getAllUsers);
};
