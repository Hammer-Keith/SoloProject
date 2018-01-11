require('dotenv').config();
const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const massive = require('massive');
const passport = require('passport')
const Auth0Strategy = require("passport-auth0")
const app = express();
const mainCtrl = require("./controllers/mainCtrl.js")
const {
    AUTH_DOMAIN,
    CLIENT_SECRET,
    CLIENT_ID,
    PORT,
    CONNECTION_STRING
} = process.env


//connect to DB
massive(CONNECTION_STRING).then(db => {
   app.set('db', db);
})
.catch(console.log);


//Middlewares
app.use(json());
app.use(cors());
app.use(
   session({
       secret:CLIENT_SECRET,
       resave: false,
       saveUninitialized: false,
       cookie: {
           maxAge: 525600 * 60 * 1000
       }
   })
);

app.use(passport.initialize())
app.use(passport.session())
passport.use(new Auth0Strategy({
     domain: AUTH_DOMAIN,
     clientSecret: CLIENT_SECRET,
     clientID: CLIENT_ID,
     scope: 'openid profile',
     callbackURL: "/auth"
}, (accessToken, refreshToken, extraParams, profile, done) =>{
    app.get('db')
    .getUserByAuthID(profile.id)
    .then(response => {
        if (!response[0]){
            app.get("db").createUserByAuthID([profile.id, profile.displayName]).then(created=> {
                return done(null, created[0]);
            })
        } else {
            return done(null, response[0])
        }
    })
}))

passport.serializeUser((user,done) =>{
return done(null, user);
}
)
passport.deserializeUser((user,done) =>{
    return done(null, user);
    }
    )

app.get('/auth', passport.authenticate("auth0", {
    successRedirect: "http://localhost:3000/",
    faliureRedirect:"http://localhost:3000/login"
}))
    
app.get('/api/me', (req, res, next) => {
    if(req.user) res.json(req.user);
    //else res.redirect("/auth")
})

app.put('/api/setBTS', (req, res, next) =>{
    console.log(req.body);
app.get('db').setBitShares([req.user.id, req.body.userNameInput]).then(()=>{res.json('do it pls')})
})

app.get("/api/getbal/:id", mainCtrl.getBalance);

// app.get('/api/test', (req,res) => {
//    const db = req.app.get("db");

//    db.products
//    .find({})
//    .then(response => {
//        res.json(response)
//    })
//    .catch(console.log);
// })

app.listen(process.env.PORT || 3001, () => {
   console.log(`Listening on ${process.env.PORT || 3001}!`)
})


