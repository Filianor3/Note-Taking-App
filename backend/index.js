require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user");
const Note = require("./models/note");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Create account
//   name: { type: String },
//   lastName: { type: String },
//   username: { type: String },
//   email: { type: String },
//   password: { type: String },
//   creationTime: { type: Date, default: new Date().getTime() },
app.post("/create-account", async (req, res) => {
  const { name, lastName, username, email, password, creationTime } = req.body;
  if (!name) {
    return res.status(400).json({ error: true, message: "name is required" });
  }
  if (!lastName) {
    return res
      .status(400)
      .json({ error: true, message: "lastName is required" });
  }
  if (!username) {
    return res
      .status(400)
      .json({ error: true, message: "username is required" });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: "email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Npasswordame is required" });
  }

  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res.json({
      error: true,
      message: "such user already exists",
    });
  }

  const user = new User({
    name,
    lastName,
    username,
    email,
    password,
    creationTime,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "300000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Success",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "password is required" });
  }

  const userInfo = await User.findOne({ email: email });
  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "300000m",
    });

    return res.json({
      error: false,
      message: "Login successful",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Info",
    });
  }
});

app.get("/get-all-users", authToken, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.json({ users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: true, message: "Failed to fetch users" });
  }
});

app.post("/add-note", authToken, async (req, res) => {
  const { header, description } = req.body;
  const { user } = req.user;
  if (!header) {
    return res.status(400).json({ error: true, message: "header is required" });
  }
  if (!description) {
    return res
      .status(400)
      .json({ error: true, message: "description is required" });
  }

  try {
    const note = new Note({
      header,
      description,
      userId: user._id,
    });
    await note.save();
    return res.json({
      error: false,
      note,
      message: "note added",
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "note not added",
    });
  }
});

app.put("/edit-note/:noteId", authToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { header, description, publicity } = req.body;
  const { user } = req.user;

  if (!header && !description && publicity === undefined) {
    return res.status(400).json({ error: true, message: "nothing changed" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res
        .status(404)
        .json({ error: true, message: "note couldnt be found" });
    }

    if (header) {
      note.header = header;
    }
    if (description) {
      note.description = description;
    }
    if (publicity !== undefined) {
      note.publicity = publicity;
    }

    await note.save();

    return res.json({
      error: false,
      note,
      message: "note edited",
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "note not edited",
    });
  }
});

app.get("/get-all-notes", authToken, async (req, res) => {
  const { user } = req.user;

  try {
    // Retrieve notes where publicity is true OR (publicity is false AND userId matches)
    const notes = await Note.find({
      $or: [{ publicity: true }, { publicity: false, userId: user._id }],
    });

    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving notes:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to retrieve notes",
    });
  }
});

app.delete("/delete-note/:noteId", authToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "not found" });
    }
    await Note.deleteOne({ _id: noteId, userId: user._id });
    return res.json({
      errror: false,
      message: "note deleted",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "server error",
    });
  }
});

app.get("/get-user", authToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });
  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({
    user: {
      name: isUser.name,
      lastName: isUser.lastName,
      email: isUser.email,
      _id: isUser._id,
      creationTime: isUser.creationTime,
    },
    message: "got user",
  });
});

app.get("/search-notes/", authToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "search query must not be empty" });
  }

  try {
    const searchNotes = await Note.find({
      $or: [
        { header: { $regex: new RegExp(query, "i") } },
        { description: { $regex: new RegExp(query, "i") } },
      ],
    });
    return res.json({
      error: false,
      notes: searchNotes,
      message: "notes retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "unexcpected error",
    });
  }
});

app.listen(8000);

module.exports = app;
