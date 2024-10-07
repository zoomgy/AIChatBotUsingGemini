import express, { json } from 'express';
import mongoose from 'mongoose';
import User from './UserModel.js';
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import cookieParser from 'cookie-parser'
import cors from 'cors';
const app = express();
const dbUrl = "mongodb+srv://ayushsinghcs21:b3en5ZiHRp2PSFAh@cluster0.yljjr.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0";
(async function (){try {const dbResponse = await mongoose.connect(dbUrl);console.log("DB Connected");} catch (error) {console.log(error);}})();
app.use(cors({origin: 'http://localhost:5173', credentials: true,}));
app.use(express.json());
app.use(cookieParser());


app.post("/register",async (req,res)=>{
    const {name , email , password} = req.body;
    const hash = await bcrypt.hash(password,10);
    (async function (){
        try {
            const newUser = new User({name,email,password:hash})
            await newUser.save();
            console.log("User Saved Successfully");
            const token = jwt.sign({id : newUser._id},"secretKey",{ expiresIn : "1h" })
            const {password , ...userWithoutPass} = newUser._doc;
            res.cookie('token',token,{
                httpOnly : true,
                secure: false,
                maxAge: 3600000
            }).send(JSON.stringify(userWithoutPass));
        } catch (error) {
            res.status(403).send(JSON.stringify({
                "error" : "credentials already exist"
            }))
        }
    })()
})



app.post("/login",async (req,res)=>{
    const {email , password} = req.body;
    (async function (){
        try {
            const user = await User.findOne({email});
            if(!user){
                res.status(401).send(JSON.stringify({
                    "error" : "No User Exist"
                }));
                return;
            }
            const passComparison = await bcrypt.compare(password,user.password);
            if(passComparison){
                const token = jwt.sign({id : user._id},"secretKey",{ expiresIn : "1h" })
                res.cookie('token',token,{
                    httpOnly : true,
                    secure: false,
                    maxAge: 3600000
                }).send(JSON.stringify(user));
            }else{
                res.status(401).send(JSON.stringify({
                    "error" : "Wrong Credentials"
                }));
            }
        } catch (error) {
            console.log(error);
        }
    })()
})


app.get('/verify-token', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(402).send({ error: "Unauthorized: No token provided" });
    }
    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: "Unauthorized: Invalid token" });
        }
        res.send({ message: "Token is valid", userId: decoded.id });
    });
});


app.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: false,
        expires: new Date(0) // Set cookie to expire in the past
    });
    res.send({ message: "Successfully logged out" });
});

app.listen(3000,()=>{
    console.log("Listening on port 3000");
})