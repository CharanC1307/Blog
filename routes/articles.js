const express = require('express')
const Article = require('../models/article')
const router = express.Router()

//https://www.restapitutorial.com/lessons/httpmethods.html#:~:text=The%20primary%20or%20most-commonly,but%20are%20utilized%20less%20frequently.

router.get('/new', (req, res) => {
    res.render('articles/new', {article: new Article()})
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug})
    if (article == null) res.redirect('/')
    res.render('articles/show', { article: article})
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article})
})

//Async https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
//From a form I tell it to go to 'articles/' then make it have a method of POST
//This is to make it save the new stuff to the database
//https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
router.post('/', (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title,
        article.description = req.body.description,
        article.markdown = req.body.markdown
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        }
        catch(e) {
            console.log(e)
            res.render(`articles/${path}`, {article: article})
        }
    }
}

module.exports = router