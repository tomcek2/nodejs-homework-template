const {
  fetchContacts,
  fetchContact,
  insertContact,
  updateContact,
  removeContact,
  updateStatusContact,
} = require("./services");
const {
  validateContactAdd,
  validateContactUpdate,
} = require("../../models/contacts");

const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contacts = await fetchContacts(userId);
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contact = await fetchContact(req.params.contactId, userId);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const userId = req.user._id;

  try {
    const { error } = validateContactAdd({ name, email, phone });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const newContact = await insertContact({ name, email, phone, userId });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const putContact = async (req, res, next) => {
  const contactId = req.params.contactId;
  const updatedFields = req.body;
  const userId = req.user._id;

  try {
    const { error } = validateContactUpdate(updatedFields);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const updatedContact = await updateContact({
      id: contactId,
      toUpdate: updatedFields,
      userId,
      upsert: true,
    });

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteContact = async (req, res, next) => {
  const id = req.params.contactId;
  const userId = req.user._id;

  try {
    const remove = await removeContact(id, userId);
    if (remove) {
      res.status(200).json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const patchContact = async (req, res, next) => {
  const contactId = req.params.contactId;
  const favorite = req.body;
  const userId = req.user._id;

  if (favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  try {
    const result = await updateStatusContact({
      contactId,
      body: favorite,
      userId,
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllContacts,
  getContact,
  createContact,
  putContact,
  deleteContact,
  patchContact,
};
