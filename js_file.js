const express = require("express")
var bodyParser = require("body-parser")

// Database
const database = require("./database") //  ./database is a js file in same directory

// Initialise express
const booky = express();
booky.use(bodyParser.urlencoded({extended: true}))
booky.use(bodyParser.json());
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


/* 
Route          /book/new
Description    Add new books
Access         PUBLIC
Parameter      None
Methods        POST
*/

booky.post("/book/new", (req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
})

/* 
Route          /author/new
Description    Add new author
Access         PUBLIC
Parameter      None
Methods        POST
*/

booky.post("/author/new", (req, res) => {
    const newAuthor = req.body
    const authExists = database.author.filter(
        (auth) => auth.id === newAuthor.id
    )
    if(authExists.length === 0){
        database.author.push(newAuthor)
        return res.json(database.author)
    }
    // return res.json(authExists)
    // if(authExists.length === 1){
    //     if(authExists.book.includes(newAuthor.books)){
    //         return res.json({error: "Author already exists"})
    //     }

    // }
    return res.json({error: "Author already exists"})
})

/* 
Route          /publication/new
Description    Add new publication
Access         PUBLIC
Parameter      None
Methods        POST
*/

booky.post("/publication/new", (req,res) => {
    const newPublication = req.body
    database.publications.push(newPublication)
    return res.json(database.publications)
})

// PUT
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
booky.delete("/book/delete/:isbn", (req,res) => {
    // whichever book that doesnt match with isbn, send it to an updatedBookDatabase array
    // and rest will be filtered out

    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )

    database.books = updatedBookDatabase
    return res.json({books: database.books})
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