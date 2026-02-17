const express = require("express");
const multer = require("multer");
const { ComplaintController } = require("../controller/");
const { validateSession } = require("../utils/sessionUtil");
const complaintRouter = express.Router();

//multer for image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "media");
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

complaintRouter.get(
  "/get-complaint",
  validateSession,
  ComplaintController.getComplaint
);
complaintRouter.post(
  "/add-complaint",
  validateSession,
  upload.single("url"),
  ComplaintController.addComplaint
);
complaintRouter.put(
  "/update-complaint",
  validateSession,
  upload.single("resolvedUrl"),
  ComplaintController.updateComplaint
);
complaintRouter.delete(
  "/delete-complaint",
  validateSession,
  ComplaintController.deleteComplaint
);
complaintRouter.get(
  "/followup-complaint",
  validateSession,
  ComplaintController.followupComplaint
);
complaintRouter.put(
  "/reject-complaint",
  validateSession,
  ComplaintController.rejectComplaint
);
module.exports = complaintRouter;
