const Photo = require("../models/Photo");
exports.getAboutPage = (req, res) => {
  res.render("about", { page_name: "about" });
};

exports.getAddPage = (req, res) => {
  res.render("add", { page_name: "add" });
};

exports.getEditPage = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render("edit", { photo, page_name: "edit" });
};
