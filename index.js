require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const { default: mongoose } = require("mongoose");
const { UserRouter, ComplaintRouter, ContactUsRouter } = require("./router/");

const app = express();
//allows only this url
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "media")));
//session
const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: "customSession",
});
// Catch errors
store.on("error", function (error) {
  console.log(error);
});
//cookies
app.use(
  require("express-session")({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60,//1 hour 
      httpOnly: true,
      secure: false,
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);
//db connection
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

//log
app.use((req, res, next) => {
  console.log(`${new Date()} :: ${req.method} :: ${req.path}`);
  next();
});

//Routers
app.use("/user", UserRouter);
app.use("/complaint", ComplaintRouter);
app.use("/contactus", ContactUsRouter)

//server started 
app.listen(process.env.PORT, () => {
  console.log(`Server started successfully on port ${process.env.PORT}`);
});
