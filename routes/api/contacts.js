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

router.get("/", getAllContacts);

router.get("/:contactId", getContact);

router.post("/", createContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", putContact);

router.patch("/:contactId/favorite", patchContact);

module.exports = router;
