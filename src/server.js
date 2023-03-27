const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const override = require("method-override");
const route = require("./routes/index");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const flash = require("connect-flash");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "secrettexthere",
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }, //3h
  })
);
app.use(bodyParser.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(override("_method"));

app.use(express.static(path.join(__dirname, "public")));
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.isAdmin = false;
  if (req.user) {
    if (req.user.role) {
      res.locals.isAdmin = req.user.role === "ADMIN";
    }
    res.locals.username = req.user.name;
  }
  res.locals.session = req.session;
  next();
});
//route init
route(app);
require("./config/passport");

//template engine
app.engine(
  "handlebars",
  handlebars({
    helpers: {
      sum: (a, b) => a + b,
      ifEquals: (arg1, arg2, options) => {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      },
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

async function startServer() {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/web_ISD",
      { useUnifiedTopology: true, useNewUrlParser: true },
      () => console.log("connect to Mongodb")
    );
    await app.listen(PORT);
    console.log(`Server running at ${PORT}`);
  } catch (err) {
    console.log("Connect failure!!!");
  }
}
startServer();
