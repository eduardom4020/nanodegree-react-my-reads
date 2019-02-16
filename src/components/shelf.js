import React from 'react';
import Book from './book';
import './styles/shelf.css';

const DEFAULT_FILTER_FUNCTION = thisShelf => book => book.shelf && book.shelf === thisShelf.value;

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