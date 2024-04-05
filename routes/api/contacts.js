const express = require("express");
const {
  validateContactAdd,
  validateContactUpdate,
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  try {
    const contact = await getContactById(contactId);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;

  try {
    const { error } = validateContactAdd({ name, email, phone });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const newContact = await addContact({ name, email, phone });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  try {
    const remove = await removeContact(contactId);
    if (remove) {
      res.status(200).json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  const updatedFields = req.body;

  try {
    const { error } = validateContactUpdate(updatedFields);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const updatedContact = await updateContact(contactId, updatedFields);
    res.status(200).json(updatedContact);
  } catch (error) {
    if (error.message === "Contact not found") {
      res.status(404).json({ message: "Not found" });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = router;
