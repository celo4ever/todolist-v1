//jshint esversion:6

// Requires
const express = require("express");
const bodyParser = require("body-parser"); //Per pillar parametres
const mongoose = require("mongoose"); // Data Base
const _ = require("lodash"); // per fer mayuscules

const app = express();


app.set('view engine', 'ejs'); //EJS amb carpeta Views!
app.use(bodyParser.urlencoded({extended: true})); //Per usar bodyParser
app.use(express.static("public"));// per accedir a la carpeta public amb els estils

mongoose.connect("mongodb+srv://admin:admin123@cluster0.31hhh.mongodb.net/TodoList", {useNewUrlParser: true}); //connexió amb mongoose

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  Item.find({}, function(error, foundItems){
    console.log(foundItems);
      res.render('list', {
        listTitle: "Today",
        newItems: foundItems
      });
  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName == "Today"){
    item.save(function(error){
      if (!error){
        res.redirect("/");
      }
    });
  }else{
    List.findOne({name: listName}, function(error, foundList){
      foundList.items.push(item);
      foundList.save(function(error){
        if (!error){
          res.redirect("/" + listName);
        }
      });

    });
  }
});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(error, foundList){
    if (!error){
      if (!foundList){
        const list = new List({
          name: customListName,
          items: []
        });
        list.save(function(error){
          res.redirect("/" + customListName);
        });
      }else{
        res.render("list", {listTitle: foundList.name, newItems: foundList.items});
      }
    }
  });

});

app.post("/delete", function(req, res){
  const checkedBox = req.body.checkbox;
  const listName = req.body.listName;

  if (listName == "Today"){
    Item.findByIdAndRemove(checkedBox, function(error){
      if (!error){
        console.log("Some Error");
        res.redirect("/");
      }
    });
  }else{
    List.findOneAndUpdate(
      {name: listName},
      {$pull:
        {items: {_id: checkedBox}}
      },
      function(error, foundList){
        if (!error) res.redirect("/" + listName);
      }
    );
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
