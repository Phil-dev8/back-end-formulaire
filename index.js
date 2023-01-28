require("dotenv").config();
const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();
app.use(cors());
app.use(express.json());

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Asiimov",
  key: process.env.API_KEY_MAILGUN,
});

app.get("/", (req, res) => {
  res.send("server is ok");
});

app.post("/form", async (req, res) => {
  console.log(req.body);
  try {
    const messageData = {
      from: `${req.body.firstname} ${req.body.lastname} ${req.body.email}`,
      to: "asiimov.dev@gmail.com",
      subject: `Formulaire JS`,
      text: req.body.message,
    };
    const response = await client.messages.create(
      process.env.DOMAIN_MAILGUN,
      messageData
    );
    console.log("response>>", response);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This routes doesn't exist" });
});

app.listen(process.env.PORT, () => {
  console.log("server started✅");
});
