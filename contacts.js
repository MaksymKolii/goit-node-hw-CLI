const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const normalizeData = JSON.parse(data);
    console.table(normalizeData);
    return normalizeData;
  } catch (err) {
    console.log(`Message:`, err);
  }
}

const switchType = (data, id) => {
  if (typeof data === "number") {
    return +id;
  }
  if (typeof data === "string") {
    return id;
  }
};

async function getContactById(contactId) {
  try {
    const normalizeData = JSON.parse(await fs.readFile(contactsPath, "utf8"));

    const value = normalizeData.filter(
      ({ id }) => switchType(contactId, id) === contactId
    );
    if (value.length === 0) {
      return console.log(`Contact with id: ${contactId} not exist`);
    }
    console.table(value);
    return value;
  } catch (err) {
    console.log(`Message:`, err);
  }
}

async function removeContact(contactId) {
  try {
    const normalizeData = JSON.parse(await fs.readFile(contactsPath, "utf8"));
    if (
      normalizeData.some(({ id }) => switchType(contactId, id) === contactId)
    ) {
      const value = normalizeData.filter(
        ({ id }) => switchType(contactId, id) !== contactId
      );
   
      await fs
        .writeFile(contactsPath, JSON.stringify(value), {
          encoding: "utf8",
        })
        .catch((err) => console.log(err.message));
    } else {
      return console.log(`Contact with id: ${contactId} not exist`);
    }
    const rewritedData= JSON.parse(await fs.readFile(contactsPath, "utf8"));
    console.table(rewritedData);

  } catch (err) {
    console.log(`Message:`, err);
  }

}

async function addContact(name, email, phone) {
  try {
    const getData = await fs.readFile(contactsPath, "utf8");
    const newData = JSON.parse(getData);

    const checkName = () => {
      if (
        newData.find((value) => value.name.toLowerCase() === name.toLowerCase())
      ) {
        return console.log(`Contact with name: ${name} already exist`);
      } else {
        return name;
      }
    };

    const checkEmail = () => {
      if (
        newData.find(
          (value) => value.email.toLowerCase() === email.toLowerCase()
        )
      ) {
        return console.log(`Contact with email: ${email} already exist`);
      } else {
        return email;
      }
    };

    const checkPhone = () => {
      if (newData.find((value) => value.phone === phone)) {
        console.log(`Contact with phone: ${phone} already exist`);
        return;
      } else {
        return phone;
      }
    };

    if (checkName() && checkEmail() && checkPhone()) {
      const value = {
        id: uuidv4().slice(0, 8),
        name: checkName(),
        email: checkEmail(),
        phone: checkPhone(),
      };
      const arr = [...newData, value];
      await fs.writeFile(contactsPath, JSON.stringify(arr), {
        encoding: "utf8",
      });
      console.table(arr);
    }
  } catch (err) {
    console.log(`Message:`, err);
  }
}

module.exports = {
  addContact,
  removeContact,
  getContactById,
  listContacts,
};
