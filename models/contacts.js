const fs = require("fs").promises;
const path = require("path");
const uniqid = require("uniqid");
const Joi = require("joi");

const contactPath = path.join(__dirname, "contacts.json");

const nameSchema = Joi.string()
  .min(2)
  .max(50)
  .pattern(/^[A-Z][a-z]*( [A-Z][a-z]*)*$/)
  .required()
  .messages({
    "string.min": "Name must have at least 2 characters",
    "string.max": "Name can have at most 50 characters",
    "string.pattern.base":
      "Name must start with an uppercase letter and contain only letters",
    "any.required": "Name is required",
  });

const emailSchema = Joi.string().email().required().messages({
  "string.email": "Invalid email format",
  "any.required": "Email is required",
});

const phoneSchema = Joi.string().required().messages({
  "any.required": "Phone number is required",
});

const validateContactAdd = (body) => {
  const schema = Joi.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
  });

  return schema.validate(body, { abortEarly: false });
};

const validateContactUpdate = (body) => {
  const schema = Joi.object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    phone: phoneSchema.optional(),
  });

  return schema.validate(body, { abortEarly: false });
};

const readContactsFile = async () => {
  try {
    const data = await fs.readFile(contactPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Could not read contacts file");
  }
};

const listContacts = async () => {
  return await readContactsFile();
};

const getContactById = async (contactId) => {
  const contacts = await readContactsFile();
  const contact = contacts.find((con) => con.id === contactId);
  return contact;
};

const removeContact = async (contactId) => {
  let contacts = await readContactsFile();
  const contactToRemove = contacts.find((con) => con.id === contactId);

  if (!contactToRemove) {
    throw Error("Contact not found");
  }

  contacts = contacts.filter((con) => con.id !== contactId);
  await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));

  return true;
};

const addContact = async (body) => {
  const { error } = validateContactAdd(body);
  if (error) {
    throw new Error(error.details[0].message);
  }

  try {
    const contacts = await readContactsFile();
    const { name, email, phone } = body;

    const newContact = {
      id: uniqid(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);

    await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    throw new Error("Could not add contact");
  }
};

const updateContact = async (contactId, body) => {
  const { error } = validateContactUpdate(body);
  if (error) {
    throw new Error(error.details[0].message);
  }

  try {
    const contacts = await readContactsFile();
    const contactToUpdate = contacts.find((con) => con.id === contactId);
    if (!contactToUpdate) {
      throw new Error("Contact not found");
    }

    for (const field in body) {
      if (field in contactToUpdate) {
        contactToUpdate[field] = body[field];
      }
    }

    await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
    return contactToUpdate;
  } catch (error) {
    if (error.message === "Contact not found") {
      throw new Error("Contact not found");
    } else {
      throw new Error("Could not update contact");
    }
  }
};

module.exports = {
  validateContactAdd,
  validateContactUpdate,
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
