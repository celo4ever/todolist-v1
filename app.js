//jshint esversion:6

// Requires
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/TodoList", {useNewUrlParser: true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



const item1 = new Item({
  name: "Welcome1"
});

const item2 = new Item({
  name: "Welcome2"
});

const item3 = new Item({
  name: "Welcome3"
});


const defaultItems = [item1,item2,item3];



app.get("/", function(req, res) {

  Item.find({}, function(error, foundItems){
    if (foundItems.length === 0){
      Item.insertMany(defaultItems, function(error){
        if(error){
          console.log(error);
        }else{
          console.log("exit");
        }
      });
      res.redirect("/");
    }else{
      res.render('list', {
        listTitle: "Today",
        newItems: foundItems
      });
    }

  });

});

app.get("/work", function(req, res){
  res.render('list', {
    listTitle: "Work List",
    newItems: workItems
  });
})

app.post("/", function(req, res){
  console.log(req.body.list);
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName == "Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName}, function(error, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
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
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
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
