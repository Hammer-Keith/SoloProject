require("dotenv").config();
const express = require("express");
const { json } = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const massive = require("massive");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const app = express();
const axios = require("axios");
const mainCtrl = require("./controllers/mainCtrl.js");
const {
  AUTH_DOMAIN,
  CLIENT_SECRET,
  CLIENT_ID,
  PORT,
  CONNECTION_STRING
} = process.env;

//connect to DB
massive(CONNECTION_STRING)
  .then(db => {
    app.set("db", db);
  })
  .catch(console.log);

//Middlewares
app.use( express.static( `${__dirname}/../build` ) );
app.use(json());
app.use(cors());
app.use(
  session({
    secret: CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 525600 * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new Auth0Strategy(
    {
      domain: AUTH_DOMAIN,
      clientSecret: CLIENT_SECRET,
      clientID: CLIENT_ID,
      scope: "openid profile",
      callbackURL: "/auth"
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
      app
        .get("db")
        .getUserByAuthID(profile.id)
        .then(response => {
          if (!response[0]) {
            app
              .get("db")
              .createUserByAuthID([profile.id, profile.displayName])
              .then(created => {
                return done(null, created[0]);
              });
          } else {
            return done(null, response[0]);
          }
        });
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user);
});
passport.deserializeUser((user, done) => {
  return done(null, user);
});

app.get(
  "/auth",
  passport.authenticate("auth0", {
    successRedirect: "http://localhost:3000/",
    faliureRedirect: "http://localhost:3000/login"
  })
);

app.get("/api/me", (req, res, next) => {
  if (req.user) res.json(req.user);
  else res.redirect("http://localhost:3000/");
});

app.get("/api/new", (req, res, next) => {
  app
    .get("db")
    .getUserByID(req.user.authid)
    .then(response => res.json(response))
    .then(() => res.redirect("http://localhost:3000/"));
});
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("http://localhost:3000/");
});

app.put("/api/setBTS", (req, res, next) => {
  app
    .get("db")
    .setBitShares([req.user.id, req.body.userNameInput])
    .then(response => {
      res.json("success!");
    });
});

app.get("/api/getbal/:id", (req, res, next) => {
  axios
    .get(
      `https://cryptofresh.com/api/account/balances?account=${req.params.id}`
    )
    .then(response => {
      res.json(response.data);
    });
  app.get("/api/getvalue/:id", (req, res, next) => {
    if (req.params.id === "BTS") {
      res.json({ price: 1 });
    } else {
      axios
        .get(`https://cryptofresh.com/api/asset/markets?asset=${req.params.id}`)
        .then(response => {
          res.json(response.data.BTS);
        });
    }
  });
});

app.get("/api/getBTSVal", (req, res, next) => {
  axios
    .get("https://cryptofresh.com/api/asset/markets?asset=BTS")
    .then(response => {
      res.json(response.data.USD.price);
    });
});

app.get("/delete", (req, res, next) => {
  app
    .get("db")
    .deleteUserByID(req.user.authid)
    .then(response => {
      req.logout();
      res.redirect("http://localhost:3000/");
    });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Listening on ${process.env.PORT || 3001}!`);
});
