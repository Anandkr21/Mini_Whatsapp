const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { userModel } = require('../model/userModel')
const { MessModel } = require('../model/msg')

require('dotenv').config();

// user signup 
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // checking all credentials are entered or not
        if (!name || !email || !password) {
            return res.status(401).send({ "msg": "Enter all credentials!" })
        }

        // checking user is exist or not
        let user = await userModel.findOne({ email })
        if (user) {
            return res.status(400).send({ "msg": "User Already Exist!" })
        }

        // password bcryption here
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


// user login 
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).send({ "err": "No user found with this email" })
        }

        // comparing password using bcryption method
        bcrypt.compare(password, user.password, async (err, result) => {
            if (result) {
                // token generation
                const token = jwt.sign({ id: user._id }, process.env.Secret_key,
                    {
                        expiresIn: '1h'  // 1Hr. validation
                    });
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

// authorize message 
exports.message = async (req, res) => {
    let name = req.params.name;
    try {
        let user = await MessModel.find({ "name": name })
        if (!user) {
            res.status(400).send({
                status: false,
                msg: "Invalid user name/user not found!"
            })
        } else {
            let allMessages = user[0].msg;
            res.status(200).send({
                status: true,
                userName: user[0].name,
                List_Of_All_Messages: allMessages
            });
        }
    } catch (error) {
        res.status(500).send({
            status: false,
            msg: "Internal server error!"
        });
    }
}
