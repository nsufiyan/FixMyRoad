const express = require("express");
const { validateSession } = require("../utils/sessionUtil");
const contactusRouter = express.Router();
const { ContactUsController } = require("../controller");

contactusRouter.post("/message", validateSession, ContactUsController.add);

module.exports = contactusRouter;
