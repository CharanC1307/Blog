const express = require("express")
const mongoose = require('mongoose')
const Article = require('./Models/article')
const articleRouter=require('./Routes/articles')
const methodOverride = require('method-override')
const path = require('path')

const app=express()

const PORT = process.env.PORT || 8080
const URI = process.env.MONGODB_URI || 'mongodb+srv://Charan:Charan1307@database.xowp4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

//Setting all files to ejs normally
app.set('Views', path.join(__dirname, '/Views'))
app.set('view engine', 'ejs')

//app.use is called whenver there is a request.
//In the next instance it is only used if your requesting from /articles
//then it goes to articleRouter
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname+'/Views')))

//Sets up a server at the '/' area. Then the function is how we handle the request. Req is incoming data. Res is the responding data.
app.get('/', async (req, res)=>{
    const articles= await Article.find().sort({ createdAt: 'desc' })
    res.render('Articles/index', {articles: articles})
})

app.use('/Articles', articleRouter)

app.listen(PORT, ()=>{console.log(`App listening at port ${PORT}`)})