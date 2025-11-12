const express = require("express");
const app = express();
const newMsg = require("./models/messages.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const flash = require("connect-flash");

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

let images = fs.readdirSync("./public/gallery").map((file) => ({
  id: uuidv4(),
  name: file,
}));

//home
app.get("/", (req, res) => {
  res.render("function/home.ejs");
});

//about me
app.get("/aboutme", (req, res) => {
  res.render("function/about.ejs");
});

//contact me
app.get("/contactme", (req, res) => {
  res.render("function/contact.ejs");
});

//index
app.get("/chat", async (req, res) => {
  const chats = await newMsg.find();
  res.render("function/show.ejs", { data: chats });
});

//art
app.get("/gallery", (req, res) => {
  res.render("function/allImage.ejs", { post: images });
});

app.get("/gallery/:id", (req, res) => {
  const { id } = req.params;
  const image = images.find((img) => img.id === id);

  if (!image) {
    return res.status(404).send("Image not found");
  }
  res.render("function/singleImage.ejs", { image });
});

//add message
app.get("/chat/add", (req, res) => {
  res.render("function/add.ejs");
});

app.post("/chat/add", async (req, res) => {
  try {
    let { message, hint } = req.body;
    let chat = new newMsg({ message, hint });
    await chat.save();
    console.log(chat);
    req.flash("success", "Your message has been sent. Thank you");
    res.redirect("/chat/add");
  } catch (err) {
    console.log(err);
  }
});

// app.get("/getmsg", async (req, res) => {
//   let msg = new newMsg({
//     message: "my name is ed",
//     hint: "2nd fav rapper",
//   });
//   await msg.save();
//   console.log(msg);
//   res.send("data has been added");
// });

app.listen(1000, (req, res) => {
  console.log("server is running");
});
