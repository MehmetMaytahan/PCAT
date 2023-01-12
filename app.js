const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");

const app = express();
const path = require("path");
const fs = require("fs");
const port = 3000;

const Photo = require("./models/Photo");
const { fstat } = require("fs");

// TEMPLATE ENGINE
app.set("view engine", "ejs");

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

// ROUTES
app.get("/", async (req, res) => {
  const Photos = await Photo.find({}).sort("-dateCreated");
  res.render("index", { Photos, page_name: "index" });
});

app.get("/about", (req, res) => {
  res.render("about", { page_name: "about" });
});

app.get("/add", (req, res) => {
  res.render("add", { page_name: "add" });
});

app.post("/photos", async (req, res) => {
  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadeImage = req.files.image;
  let uploadPath = path.join(__dirname, "public/uploads", uploadeImage.name);

  uploadeImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: `/uploads/${uploadeImage.name}`
    });
    res.redirect("/");
  });

  // await Photo.create(req.body);
});

app.get("/photos/:id", async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo-detail", { photo, page_name: "photo_detail" });
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
