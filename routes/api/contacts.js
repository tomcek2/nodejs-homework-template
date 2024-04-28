const express = require("express");
const router = express.Router();

const {
  getAllContacts,
  getContact,
  createContact,
  deleteContact,
  putContact,
  patchContact,
} = require("../../controllers/contacts/index");

const authenticateToken = require("../../middleware/authenticateToken");

router.get("/", authenticateToken, getAllContacts);

router.get("/:contactId", authenticateToken, getContact);

router.post("/", authenticateToken, createContact);

router.delete("/:contactId", authenticateToken, deleteContact);

router.put("/:contactId", authenticateToken, putContact);

router.patch("/:contactId/favorite", authenticateToken, patchContact);

module.exports = router;
