const express = require("express")
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter=require('./routes/articles')
const methodOverride = require('method-override')
const path = require('path')

const app=express()

const PORT = process.env.PORT || 8080
const URI = process.env.MONGODB_URI

mongoose.connect(URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

//Setting all files to ejs normally
app.set('views', path.join(process.cwd(), '/views'))
app.set('view engine', 'ejs')

//app.use is called whenver there is a request.
//In the next instance it is only used if your requesting from /articles
//then it goes to articleRouter
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(process.cwd()+'/views')))

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