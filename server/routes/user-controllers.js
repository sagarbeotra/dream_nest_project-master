const User = require("../models/User.js");
const { hash, compare } = require("bcrypt");
const { createToken } = require("./token-manager.js");

const COOKIE_NAME = "auth_token";

const userSignup = async (req, res, next) => {
    try {
        const { firstName, lastName , email, password, profileImagePath } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(401).send("Email already registered!");

        const hashedPassword = await hash(password, 10);

        const user = new User({ firstName, lastName, email, password: hashedPassword, profileImagePath });
        await user.save();

        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });

        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });

        return res.status(201).json({
            message: "Data Fetched. OK",
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "ERROR", cause: error.message });
    }
};

const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send("User Not Registered.!");
        }

        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).send("Incorrect Password");
        }

        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });

        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });

        return res.status(200).json({ token, user })

        // return res.status(200).json({
        //     message: "Data Fetched. OK",
        //     name: user.firstName,
        //     email: user.email
        // });

    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "ERROR", cause: error.message });
    }
};

const verifyUser = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);

        if (!user) {
            return res.status(401).send("User Not Registered OR Token malfunctioned");
        }

        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Credentials didn't match!");
        }

        return res.status(200).json({
            message: "Data Fetched. OK",
            name: user.firstNamename,
            email: user.email
        });

    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "ERROR", cause: error.message });
    }
};

const userLogout = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }

        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });

        return res.status(200).json({ message: "OK", name: user.name, email: user.email });

    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

module.exports = {
    userSignup,
    userLogin,
    verifyUser,
    userLogout,
};
