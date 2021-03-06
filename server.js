"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

const usersData = (data) => {
    return users.find((user) => Object.values(user).includes(data));
};

const friendsData = (friendsList) => {
    return users.filter((user) => friendsList.includes(user._id));
};

// declare the 404 function
const handleFourOhFour = (req, res) => {
    res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
    //200 OK
    //201 Created -> e.g.:Create a new page
    res.status(200).render("pages/homepage", { users, currentUser });
};

const handleProfilePage = (req, res) => {
    const _id = req.params._id;
    const user = usersData(_id);

    if (user) {
        res.status(200).render("pages/profile", {
            user: user,
            currentUser: currentUser,
            friends: friendsData(user.friends),
        });
    } else {
        res.status(404).redirect("/");
    }
};

const handleSignin = (req, res) => {
    if (currentUser.name) {
        //301 Moved Permanently
        //307 Temporary Redirect
        res.status(301).redirect("/");
    } else {
        res.status(200).render("pages/signin", { currentUser });
    }
};

const handleName = (req, res) => {
    const firstName = req.query.firstName;
    const user = usersData(firstName);

    if (user) {
        currentUser = user;
        res.status(200).redirect(`users/${user._id}`);
    } else {
        res.status(404).redirect("/signin");
    }
};

// -----------------------------------------------------
// server endpoints
express()
    .use(morgan("dev"))
    .use(express.static("public"))
    .use(express.urlencoded({ extended: false }))
    .set("view engine", "ejs")

    // endpoints
    .get("/", handleHomepage)
    .get("/users/:_id", handleProfilePage)
    .get("/signin", handleSignin)
    .get("/getname", handleName)

    // a catchall endpoint that will send the 404 message.
    .get("*", handleFourOhFour)

    .listen(8080, () => console.log("Listening on port 8080"));
