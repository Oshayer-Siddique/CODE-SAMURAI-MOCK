class Book {
    constructor(id, title, author, genre, price) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.price = price;
    }


    static fromData(data) {
        const { id, title, author, genre, price } = data;
        return new Book(id, title, author, genre, price);
    }
}

module.exports = Book;
