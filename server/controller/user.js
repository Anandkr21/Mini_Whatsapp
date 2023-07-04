const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { userModel } = require('../model/userModel')
const { MessModel } = require('../model/msg')

require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(401).send({ "msg": "Enter all credentials!" })
        }

        let user = await userModel.findOne({ email })
        if (user) {
            return res.status(400).send({ "msg": "User Already Exist!" })
        }

        bcrypt.hash(password, 8, async (err, hash) => {
            if (hash) {
                await userModel.insertMany([{ name, email, password: hash }]);
                return res.status(201).send({
                    "msg": "Signup successfully"
                })
            } else {
                return res.status(400).send({
                    "msg": " Something error"
                })
            }
        })
    } catch (error) {
        res.statur(400).send({ "msg": error.message });
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).send({ "err": "No user found with this email" })
        }

        bcrypt.compare(password, user.password, async (err, result) => {
            if (result) {
                const token = jwt.sign({ id: user._id }, process.env.Secret_key, { expiresIn: '1h' });
                res.status(200).send({
                    status: true,
                    msg: "You have been logged in successfully",
                    token: token,
                    data: user
                })
            }
            else {
                res.status(400).send({
                    status: false,
                    msg: "Wrong password",
                })
            }
        });
    }
    catch (err) {
        res.status(500).send({
            status: false,
            msg: "Internal server error!"
        });
        console.log("message:", err);
    }
}


exports.message = async (req, res) => {
    let nae = req.params.name;
    try {
        let user = await MessModel.find({ "name": nae })
        let allmsg = user[0].msg;
        res.send(allmsg);
    }
    catch (err) {
        res.send(err);
    }
}
