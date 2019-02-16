import React from 'react';
import Book from './book';
import './styles/shelf.css';

const Shelf = ({
    books, 
    shelves, 
    thisShelf,
    moveBookToShelf = null, 
    filterFunc = book => book.shelf && book.shelf == thisShelf.value,
    children=null
}) => (
    <React.Fragment>
        <h1>{thisShelf.name}</h1>
        <div className='list-books-content'>
            {
                books.length > 0 
                ? books.filter(filterFunc)
                .map(book => (
                    <div style={{margin: '1vh 1vw 1vh 1vw', padding: 0}} >
                        <Book 
                            thisBook={book} 
                            shelves={shelves}
                            moveBookToShelf={moveBookToShelf}
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