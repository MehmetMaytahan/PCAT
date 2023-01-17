const Photo = require("../models/Photo");

const fs = require("fs");

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1;
  const photosPerPage = 3;
  const totalPhotos = await Photo.find().countDocuments();

  const Photos = await Photo.find({})
    .sort("-dateCreated")
    .skip((page - 1) * photosPerPage)
    .limit(photosPerPage);

  res.render("index", {
    Photos,
    current: page,
    pages: Math.ceil(totalPhotos / photosPerPage),
    page_name: "index"
  });
  res.status(200);
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo-detail", { photo, page_name: "photo_detail" });
};

exports.createPhoto = async (req, res) => {
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
};

exports.updatePhoto = async (req, res) => {
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
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  if (fs.existsSync(`public/${photo.image}`)) {
    fs.unlinkSync(`public/${photo.image}`);
  }
  await Photo.findByIdAndDelete(req.params.id);
  res.redirect("/");
};
