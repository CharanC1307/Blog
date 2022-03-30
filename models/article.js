const mongoose = require('mongoose')
//converts html to markdown
const marked = require('marked')
//creates a slug based of titles for urls
const slugify = require('slugify')
//CHeck if there are malicious code inside the markdown area
const createDomPurify = require('dompurify')
//Helps us render html inside node
//Also since inside brackets we are only getting a specific portion of the jsdom library.
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanatizedHtml: {
        type: String,
        require: true
    }
})

//Check if the unique works
//Run this function before validation
articleSchema.pre('validate', function(next) {
    //Check if there title
    //Then turns into a simple slug that is from the title and is all lower case and removes charcters from the title
    //that can't be in the url
    if (this.title){
        this.slug = slugify(this.title, { lower: true, strict: true})
    }

    if (this.markdown) {
        //Changes markdown to html.
        //then purifies it from malicious code.
        this.sanatizedHtml = dompurify.sanitize(marked.parse(this.markdown))
    }
    next()
})

module.exports = mongoose.model('Article', articleSchema)