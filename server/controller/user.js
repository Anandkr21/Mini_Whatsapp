const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { userModel } = require('../model/userModel')
const { msgModel } = require('../model/msgModel')

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
    try {
        var msg = new Msg({
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            message:req.body.message,
        });

        await msg.save();
        res.status(200).send({
            status:true,
            msg: "Chat stored"
        })
    } catch (error) {
        res.status(400).send({
            status: false,
            msg: error.message
        })
    }
}

exports.alluser = (req,res) =>{
    res.send('ok')
}