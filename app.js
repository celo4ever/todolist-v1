//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var items = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res) {
  var options = { weekday: 'long',
                  month: 'long',
                  day: 'numeric' };

  var today = new Date();
  var day = today.toLocaleDateString("en-ES",options);

  res.render('list', {
    kindOfDay: day,
    newItems: items
  });
});

app.post("/", function(req, res){
  console.log(req.body.newItem);
  var item = req.body.newItem;
  items.push(item);

  res.redirect("/");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
