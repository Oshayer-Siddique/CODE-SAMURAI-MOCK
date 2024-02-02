let testArray = [
    {
        "id": 5,
        "title": "Sense and Sensibility",
        "author": "Jane Austen",
        "genre": "Romance",
        "price": 17.99
    },
    {
        "id": 6,
        "title": "Emma",
        "author": "Jane Austen",
        "genre": "Romance",
        "price": 22.99
    },
    {
        "id": 4,
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "genre": "Romance",
        "price": 29.99
    },
    {
        "id": 11,
        "title": "Island",
        "author": "Aldous Huxley",
        "genre": "Science Fiction",
        "price": 16.99
    }
]



/**
 * 
 * @param {Array} array An array of JSONs. Specifically, the JSONs shown in the testArray
 * @param {string} basis Which property the array needs to be sorted in, such as "title" or "id"
 * @param {string} order Ascending order "ASC", Descending order "DESC"
 * @returns a sorted array
 */

function sortBooks(array, basis = "id", order = "ASC") {
    let arr = [...array]
    if (basis == "id" || basis == "price") {
        if (order == "ASC")
            arr.sort((first, second) => (first[basis] - second[basis]));
        else
            arr.sort((first, second) => (second[basis] - first[basis]));
    }
    else {
        if (order == "ASC")
            arr.sort((first, second) => (first[basis].localeCompare(second[basis])));
        else
            arr.sort((first, second) => (second[basis].localeCompare(first[basis])));
    }
    return arr;
}
// console.log(sortBooks(testArray, 'id', 'ASC'));


/**
 * 
 * @param {Array} testArray An array of JSONs. Specifically, the JSONs shown in the testArray
 * @param {string} key The property to be searched
 * @param {string} value The value being looked for
 * @returns a filtered array
 */
function searchBooksByProperty(testArray, key, value) {
    return testArray.filter((book)=>{
        return book[key] == value;
    });
}

//console.log(searchBooksByProperty(testArray, "author", "Aldous Huxley"));