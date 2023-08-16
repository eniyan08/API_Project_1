const express = require("express")

// Database
const database = require("./database") //  ./database is a js file in same directory

// Initialise express
const booky = express();

/* 
Route          /
Description    Get all the books
Access         PUBLIC
Parameter      None
Methods        GET
*/

booky.get("/", (req, res) => {
    return res.json({books: database.books});
})

/* 
Route          /is
Description    Get specific book on ISBN
Access         PUBLIC
Parameter      isbn
Methods        GET
*/

booky.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    )

    if(getSpecificBook.length === 0) {
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

booky.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category) //category is an array
    )

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

booky.get("/publication", (req, res) => {
    return res.json({Publications: database.publications})
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

booky.listen(3000, () => {
    console.log("Server on port 3000 is up and running")
})