const { Contact } = require("../../models/contacts");

const fetchContacts = () => {
  return Contact.find();
};

const fetchContact = (id) => {
  return Contact.findById({ _id: id });
};

const insertContact = ({ name, email, phone }) => {
  return Contact.create({ name, email, phone });
};

const updateContact = async ({ id, toUpdate, upsert = false }) => {
  return Contact.findByIdAndUpdate(
    { _id: id },
    { $set: toUpdate },
    { new: true, runValidators: true, strict: "throw", upsert }
  );
};

const removeContact = (id) => Contact.deleteOne({ _id: id });

const updateStatusContact = async ({ contactId, body }) => {
  return Contact.findByIdAndUpdate(
    { _id: contactId },
    { $set: body },
    { new: true, runValidators: true, strict: "throw" }
  );
};

module.exports = {
  fetchContacts,
  fetchContact,
  insertContact,
  updateContact,
  removeContact,
  updateStatusContact,
};
