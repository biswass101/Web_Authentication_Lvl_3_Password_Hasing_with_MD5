const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const md5 = require('md5')
const User = require('./models/user.model')
require('dotenv').config()
const app = express()
const dbURL = process.env.DB_URL

mongoose.connect(dbURL)
    .then(() => {
        console.log("MongoDB Atlas is connected");
    })
    .catch(err => console.log(err))

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.get('/user', async (req, res) => {
    try {
        const getAllUsers = await User.find().select('_id email');
        res.status(200).json(getAllUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/user/register', async (req, res) => {
    // const {email, pswd} = req.body
    try {
        const newUser = new User({
            email: req.body.email,
            pswd: md5(req.body.pswd)
        })
        await newUser.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/user/login', async (req, res) => {
    try {
        let { email, pswd } = req.body
        pswd = md5(pswd)
        const findUser = await User.findOne({ email: email })
        if(findUser) {
            if(pswd === findUser.pswd) {
                res.status(200).json({
                    status: "Authorized",
                    message: "Login Successful"
                })
            } else {
                res.status(401).json({
                    status: "Unauthorized",
                    message: "Wrong Password!"
                })
            }
        } else {
            res.status(404).json({
                status: "Unauthorized",
                message: "User not found!"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

//route error
app.use((req, res, next) => {
    res.status(404).send({ message: "Route Not Found" })
})

//server error
app.use((err, req, res, next) => {
    res.status(500).send({ message: "Something Broke" })
})

app.listen((process.env.PORT || 5000), () => {
    console.log('Server is running at ' + process.env.PORT);
})

