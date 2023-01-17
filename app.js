const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const methodOverride = require("method-override");

const app = express();
const path = require("path");
const fs = require("fs");
const port = 3000;

const Photo = require("./models/Photo");
const {
  getAllPhotos,
  getPhoto,
  createPhoto,
  updatePhoto,
  deletePhoto
} = require("./controllers/photoControllers");
const {
  getAboutPage,
  getAddPage,
  getEditPage
} = require("./controllers/pageContollers");

// TEMPLATE ENGINE
app.set("view engine", "ejs");

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

// ROUTES

app.get("/", getAllPhotos); // route to home page
app.get("/photos/:id", getPhoto); // route to get photo detail
app.post("/photos", createPhoto); // add new photo
app.put("/photos/:id", updatePhoto); // update photo
app.delete("/photos/:id", deletePhoto); // delete photo
app.get("/about", getAboutPage); // route to about page
app.get("/add", getAddPage); // route to add page
app.get("/photos/edit/:id", getEditPage); // route to edit photo

mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://pcat-app:123456789123456@cluster0.nnkd0dq.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  err => {
    if (err) throw err;
    console.log("Connected to DB");
  }
);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
