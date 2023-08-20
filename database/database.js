const books = [
    {
        ISBN: "12345Book",
        title: "Harry Potter",
        pubDate: "08-08-2002",
        language: "English",
        numPage: 250,
        author: [1,2],
        publications: [1],
        category: ["fantasy", "fairy tale"]
    },
    {
        ISBN: "2000PS",
        title: "Ponniyin Selvan",
        pubDate: "01-01-2000",
        language: "Tamil",
        numPage: 500,
        author: [3],
        publications: [2],
        category: ["fantasy", "Historical"]
    },
    {
        ISBN: "3000SS",
        title: "Sivagamiyin Sabatham",
        pubDate: "02-02-2001",
        language: "Tamil",
        numPage: 400,
        author: [3],
        publications: [2],
        category: ["fantasy", "family"]
    }
]

const author = [
    {
        id: 1,
        name: "Harry",
        books: ["12345Book", "secretBook"]
    },
    {
        id: 2,
        name: "Emma",
        books: ["12345Book"]
    },
    {
        id: 3,
        name: "Kalki Krishnamoorthy",
        books: ["2000PS"]
    }
]

const publications = [
    {
        id: 1,
        name: "Writex",
        books: ["12345Book"]
    },
    {
        id: 2,
        name: "Kalki Magazines",
        books: ["2000PS","3000SS"]
    }
]

module.exports = {books, author, publications}
// due to security reasons we cannot use these contents(ie. arrays) inside another file
// So we need to export them