class Book {
    constructor(id, title, author, genre, price) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.price = price;
    }

    // You can add methods here if needed

    // Static method to create a Book instance from a data object
    static fromData(data) {
        const { id, title, author, genre, price } = data;
        return new Book(id, title, author, genre, price);
    }
}

module.exports = Book;
