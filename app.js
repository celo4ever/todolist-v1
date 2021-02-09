//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let items = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  let options = { weekday: 'long',
                  month: 'long',
                  day: 'numeric' };

  let today = new Date();
  let day = today.toLocaleDateString("en-ES",options);

  res.render('list', {
    kindOfDay: day,
    newItems: items
  });
});

app.post("/", function(req, res){
  console.log(req.body.newItem);
  let item = req.body.newItem;
  items.push(item);

  res.redirect("/");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
