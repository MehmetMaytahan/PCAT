const express = require("express");
const mongoose = require("mongoose");

const app = express();
const path = require("path");
const port = 3000;

const Photo = require("./models/Photo");

// TEMPLATE ENGINE
app.set("view engine", "ejs");

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES
app.get("/", async (req, res) => {
  const Photos = await Photo.find({});
  res.render("index", { Photos, page_name: "index" });
});

app.get("/about", (req, res) => {
  res.render("about", { page_name: "about" });
});

app.get("/add", (req, res) => {
  res.render("add", { page_name: "add" });
});

app.post("/photos", async (req, res) => {
  await Photo.create(req.body);
  res.redirect("/");
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
