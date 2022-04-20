require('dotenv').config()
const express = require("express")
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter=require('./routes/articles')
const methodOverride = require('method-override')
const path = require('path')

const PORT = process.env.PORT
const URI = process.env.MONGODB_URI
const app=express()

mongoose.connect(URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "))
db.once("open", function () {
    console.log("Connected successfully")
});

//Setting all files to ejs normally
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

//app.use is called whenver there is a request.
//In the next instance it is only used if your requesting from /articles
//then it goes to articleRouter
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, '/views')))
app.use('/favicon.ico', express.static(path.join(__dirname, 'favicon.ico')))

//Sets up a server at the '/' area. Then the function is how we handle the request. Req is incoming data. Res is the responding data.
app.get('/', async (req, res)=>{
    const articles= await Article.find().sort({ createdAt: 'desc' })
    try {
        res.render('articles/index', {articles: articles})
    }
    catch(e) {
        console.log(e)
    }
})

app.use('/articles', articleRouter)

app.listen(PORT, ()=>{console.log(`App listening at port ${PORT}`)})