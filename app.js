const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const methodOverride = require("method-override");

const app = express();
const path = require("path");
const fs = require("fs");
const port = 3000;

const Photo = require("./models/Photo");

// TEMPLATE ENGINE
app.set("view engine", "ejs");

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

// ROUTES

// route to home page
app.get("/", async (req, res) => {
  const Photos = await Photo.find({}).sort("-dateCreated");
  res.render("index", { Photos, page_name: "index" });
});

// route to about page
app.get("/about", (req, res) => {
  res.render("about", { page_name: "about" });
});

// route to add page
app.get("/add", (req, res) => {
  res.render("add", { page_name: "add" });
});

// add new photo
app.post("/photos", async (req, res) => {
  const uploadDir = "public/uploads";
  let uploadImage = req.files;

  // if there is no uploads folder, create one
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // if there is no picture uploaded
  if (uploadImage === null) {
    await Photo.create({
      ...req.body
    });
    res.redirect("/");
  } else {
    let uploadPath = path.join(
      __dirname,
      "public/uploads",
      uploadImage.image.name
    );

    uploadImage.image.mv(uploadPath, async () => {
      await Photo.create({
        ...req.body,
        image: `/uploads/${uploadImage.image.name}`
      });
    });
    res.redirect("/");
  }
});

// route to get photo detail
app.get("/photos/:id", async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo-detail", { photo, page_name: "photo_detail" });
});

// route to edit photo
app.get("/photos/edit/:id", async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render("edit", { photo, page_name: "edit" });
});

// update photo
app.put("/photos/:id", async (req, res) => {
  let uploadedImage = req.files; // you can use req.files.file.mv() to save file
  const photo = await Photo.findOne({ _id: req.params.id });

  // if there is no picture uploaded
  if (uploadedImage === null) {
    photo.title = req.body.title;
    photo.description = req.body.description;
    await photo.save();
    res.redirect(`/photos/${photo._id}`);
  } else {
    let uploadPath = path.join(
      __dirname,
      "public/uploads",
      uploadedImage.image.name
    );

    uploadedImage.image.mv(uploadPath, async () => {
      photo.title = req.body.title;
      photo.description = req.body.description;
      photo.image = `/uploads/${uploadedImage.image.name}`;
      await photo.save();
    });
    if (fs.existsSync(`public/${photo.image}`)) {
      fs.unlinkSync(`public/${photo.image}`);
    }
    res.redirect(`/photos/${photo._id}`);
  }
});

// delete photo
app.delete("/photos/:id", async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  if (fs.existsSync(`public/${photo.image}`)) {
    fs.unlinkSync(`public/${photo.image}`);
  }
  await Photo.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb://127.0.0.1/pcat-test-db",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  err => {
    if (err) throw err;
    console.log("Connected to DB");
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  }
);
