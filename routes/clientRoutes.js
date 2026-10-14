const express = require("express");
const { createClientController } = require("../controllers/clientController");
module.exports = (dataPath) => {
  const router = express.Router();
  const controller = createClientController(dataPath);
  router.get("/", controller.home);
  router.get("/clients", controller.list);
  router.get("/clients/:id", controller.details);
  return router;
};
