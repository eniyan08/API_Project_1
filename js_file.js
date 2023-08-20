require("dotenv").config();

const express = require("express")
const mongoose = require("mongoose")
var bodyParser = require("body-parser")

// Database
const database = require("./database/database") //  ./database is a js file in same directory

// Models
const BookModel = require("./database/book")
const AuthorModel = require("./database/author")
const PublicationModel = require("./database/publication")

// Initialise express
const booky = express();
booky.use(bodyParser.urlencoded({extended: true}))
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connection Established"))

/* 
Route          /
Description    Get all the books
Access         PUBLIC
Parameter      None
Methods        GET
*/

booky.get("/", async(req, res) => {
    const getAllBooks = await BookModel.find()
    return res.json(getAllBooks);
})

/* 
Route          /is
Description    Get specific book on ISBN
Access         PUBLIC
Parameter      isbn
Methods        GET
*/

booky.get("/is/:isbn", async(req, res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn})
    // null property
    if(!getSpecificBook) {
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
    }

    return res.json({book: getSpecificBook})
})

/* 
Route          /c
Description    Get specific book on category
Access         PUBLIC
Parameter      category
Methods        GET
*/

booky.get("/c/:category", async(req, res) => {
    const getSpecificBook = await BookModel.findOne({category: req.params.category})
    // includes function  

    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the category of ${req.params.category}`})
    }

    return res.json({book: getSpecificBook})
})

/* 
Route          /l
Description    Get specific book on language
Access         PUBLIC
Parameter      language
Methods        GET
*/

booky.get("/l/:lang", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.lang
    )

    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the language of ${req.params.lang}`})
    }

    return res.json({book: getSpecificBook})
})

/* 
Route          /author
Description    Get all the authors
Access         PUBLIC
Parameter      None
Methods        GET
*/

booky.get("/author", (req, res) => {
    return res.json({authors: database.author});
})

/* 
Route          /a
Description    Get specific book of author
Access         PUBLIC
Parameter      auth
Methods        GET
*/

booky.get("/a/:auth", (req, res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.name === req.params.auth
    )

    if(getSpecificAuthor.length === 0) {
        return res.json({error: `No author found in the name of ${req.params.auth}`})
    }

    return res.json({author: getSpecificAuthor})
})


/* 
Route          /author/book
Description    Get list of author for particular isbn 
Access         PUBLIC
Parameter      isbn
Methods        GET
*/

booky.get("/author/book/:isbn", (req, res) => {
    const getListOfAuthors = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    )
    
    if (getListOfAuthors === 0) {
        return res.json({error: `No author found for the book isbn of ${req.params.isbn}`})
    }
    
    return res.json({Authors: getListOfAuthors})
})

/* 
Route          /publication
Description    Get all the publications
Access         PUBLIC
Parameter      None
Methods        GET
*/

booky.get("/publication", async(req, res) => {
    const getAllPublications = await PublicationModel.find()
    return res.json(getAllPublications)
})

/* 
Route          /p
Description    Get specific publications
Access         PUBLIC
Parameter      id
Methods        GET
*/

booky.get("/p/:id", (req,res) => {
    const getSpecificPublication = database.publications.filter(
        (pub) => pub.id === parseInt(req.params.id)    // without parseInt it takes the parameter as a string
    )

    if(getSpecificPublication.length === 0) {
        return res.json({error: `No specific publication found for the given id ${req.params.id}`})
    }

    return res.json({Publications: getSpecificPublication})
})

/* 
Route          /publication/book
Description    Get specific publications based on book
Access         PUBLIC
Parameter      isbn
Methods        GET
*/

booky.get("/publication/book/:isbn", (req, res) => {
    const getSpecificPublication = database.publications.filter(
        (pub) => pub.books.includes(req.params.isbn)
    )

    if(getSpecificPublication.length === 0) {
        return res.json({error: `No publication found for isbn of ${req.params.isbn}`})
    }

    return res.json({Publications: getSpecificPublication})
})


/* 
Route          /book/new
Description    Add new books
Access         PUBLIC
Parameter      None
Methods        POST
*/

booky.post("/book/new", async(req,res) => {
    const { newBook } = req.body;
    const addNewBook = BookModel.create(newBook)
    return res.json({
        books: addNewBook,
        message: "Book was added"
    })
    
})

/* 
Route          /author/new
Description    Add new author
Access         PUBLIC
Parameter      None
Methods        POST
*/

booky.post("/author/new", async(req, res) => {
    const { newAuthor } = req.body //destructuring
    const addNewAuthor = AuthorModel.create(newAuthor)
    return res.json(
        {
            author: addNewAuthor,
            message: "Author was added"
        }
    )
})

/* 
Route          /publication/new
Description    Add new publication
Access         PUBLIC
Parameter      None
Methods        POST
*/

booky.post("/publication/new", async(req,res) => {
    const { newPublication } = req.body
    const addNewPublication = PublicationModel.create(newPublication)
    return res.json(
        {
            publication: addNewPublication,
            message: "Publication was added"
        }
    )
    
})

// PUT

/* 
Route          /book/update
Description    Update book on isbn
Access         PUBLIC
Parameter      isbn
Methods        PUT
*/

booky.put("/book/update/:isbn", async(req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn  // this parameter to find one
        },
        {
            title: req.body.bookTitle // this parameter is to update the found one
        },
        {
            new: true  // this is to show the updated database on the frontend(ie. on mongoDB and postman)
        }
    )

    return res.json({
        books: updatedBook
    })
})

// Updating new Auhtor
/* 
Route          /book/author/update
Description    Update /add new author
Access         PUBLIC
Parameter      isbn
Methods        PUT
*/
booky.put("/book/author/update/:isbn", async(req,res) => {
    // Update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet: {
                author: req.body.newAuthor
            }
        },
        {
            new: true
        }
    )
    // Update author database
    const updatedAuthor =  await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor
        },
        {
            $addToSet: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    )
    return res.json(
        {
            books: updatedBook,
            authors: updatedAuthor,
            message: "New author was added"
        }
    )
})



/* 
Route          /publication/update/book
Description    Update /add new publication
Access         PUBLIC
Parameter      isbn
Methods        PUT
*/

booky.put("/publication/update/book/:isbn", (req,res) => {

    // Update the publication database
    database.publications.forEach((pub) => {
        if(pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn)
        }
    })

    // Update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId
            return
        }
    })

    return res.json({
        books: database.books,
        publications: database.publications,
        message: "Successfully updated publications"
    })
})

// DELETE
/* 
Route          /book/delete
Description    Delete a book
Access         PUBLIC
Parameter      isbn
Methods        DELETE
*/
booky.delete("/book/delete/:isbn", async(req,res) => {
    // whichever book that doesnt match with isbn, send it to an updatedBookDatabase array
    // and rest will be filtered out

    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn 
        }
    )
    
    return res.json({
        books: updatedBookDatabase
    })
})



/* 
Route          /book/delete/author
Description    Delete author from book and related book from author
Access         PUBLIC
Parameter      isbn, authorId
Methods        DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    // Update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            )
            book.author = newAuthorList
            return
        }
    })


    // Update the author database
    database.author.forEach((auth) => {
        if(auth.id === parseInt(req.params.authorId)) {
            const newBookList = auth.books.filter(
                (eachBook) => eachBook !== req.params.isbn
            )
            auth.books = newBookList
            return
        }
    })

    return res.json({
        book: database.books,
        author: database.author,
        message: "author was deleted"
    })
})


booky.listen(3000, () => {
    console.log("Server on port 3000 is up and running")
})