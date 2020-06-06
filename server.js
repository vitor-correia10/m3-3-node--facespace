"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

const usersData = (data) => {
    return users.find((user) => Object.values(user).includes(data));
};

// declare the 404 function
const handleFourOhFour = (req, res) => {
    res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
    res.status(200).render("pages/homepage", { users: users });
};

const handleProfilePage = (req, res) => {
    const _id = req.params._id;
    const user = usersData(_id);

    res.status(200).render("pages/profile", {
        user: user,
    });
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

    // a catchall endpoint that will send the 404 message.
    .get("*", handleFourOhFour)

    .listen(8080, () => console.log("Listening on port 8080"));
