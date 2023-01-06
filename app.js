const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {

  const photo = {
    id: 1,
    name: "My first photo",
    description: "This is my first photo"
  };


  res.send(photo);

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
