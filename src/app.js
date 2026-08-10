import express from "express"
import cookieParser from "cookie-parser" //use for setting and accessing  the cookies 
import cors from "cors"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
//for taking the data from form in "json format"
app.use(express.json({limit:"16kb"}))

//for taking the data from url
app.use(express.urlencoded({extended:true,
    limit:"16kb"}))
// for storing the file folder 
app.use(express.static("public"))

app.use(cookieParser())

export {app }