import React from 'react';
import Book from './book';
import './styles/shelf.css';

const Shelf = ({books, shelves, thisShelf, moveBookToShelf=null}) => (
    <React.Fragment>
        <h1>{thisShelf.name}</h1>
        <div className='list-books-content'>
            {
                books.filter(book => book.shelf && book.shelf == thisShelf.value)
                .map(book => (
                    <div style={{margin: '1vh 1vw 1vh 1vw', padding: 0}} >
                        <Book 
                            thisBook={book} 
                            shelves={shelves}
                            moveBookToShelf={moveBookToShelf}
                        />
                    </div>
                ))
            }
        </div>
    </React.Fragment>
)

export default Shelf;