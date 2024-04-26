const { Contact } = require("../../models/contacts");

const fetchContacts = (userId) => {
  return Contact.find({ owner: userId });
};

const fetchContact = (id, userId) => {
  return Contact.findOne({ _id: id, owner: userId });
};

const insertContact = ({ name, email, phone, userId }) => {
  return Contact.create({ name, email, phone, owner: userId });
};

const updateContact = async ({ id, toUpdate, userId, upsert = false }) => {
  return Contact.findByIdAndUpdate(
    { _id: id, owner: userId },
    { $set: toUpdate },
    { new: true, runValidators: true, strict: "throw", upsert }
  );
};

const removeContact = (id, userId) =>
  Contact.deleteOne({ _id: id, owner: userId });

const updateStatusContact = async ({ contactId, body, userId }) => {
  return Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
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
