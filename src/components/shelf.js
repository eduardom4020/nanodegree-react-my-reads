import React from 'react';
import Book from './book';
import './styles/shelf.css';

/**
 * Shelf
 * @namespace Shelf
 */

/**
* @description The initial configuration of a shelf filter. 
* It determines the books that can be in that shelf.
* @constant
* @type {Array}
* @default
*/
const DEFAULT_FILTER_FUNCTION = thisShelf => book => book.shelf && book.shelf === thisShelf.value;

/**
* @class
* @classdesc This class describes a shelf object. When creating a shelf you
* shold pass as props a list of books, a list of shelves and an object containing the
* info about this shelf. You should pass too a function to move books bettwen shelves.
* Optionally, you can change the filter function of this shelf passing the to parameter
* filterFunc a function that filters wich books you whant to show. It's very usefull when
* you have the same source of books and whant to pass them to all shelves, without filter
* on parent's level. The children props of this object contains what will be showed by
* the shelf when it has no content.
* @type {Component}
*/
const Shelf = ({books, shelves, thisShelf, moveBookToShelf = null, filterFunc = DEFAULT_FILTER_FUNCTION(thisShelf), children=null}) => (
    <React.Fragment>
        <h1>{thisShelf.name}</h1>
        <div className='list-books-content'>
            {
                books.length > 0 
                ? books.filter(filterFunc)
                .map((book, it) => (
                    <div className='book-container' key={`bookContainer${it}`}>
                        <Book 
                            thisBook={book} 
                            shelves={shelves}
                            moveBookToShelf={moveBookToShelf}
                            key={`book${it}`}
                        />
                    </div>
                ))
                : children == null
                ? (
                    <div className='empty-list-books'>
                        <h3>This Shelf is Empty</h3>
                        <p>Please click on + button bellow or access /search page to find books to place on shelves!</p>
                    </div>
                )
                : children
            }
        </div>
    </React.Fragment>
)

export default Shelf;