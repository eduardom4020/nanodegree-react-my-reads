import React from 'react';
import Book from './book';

const Shelf = ({books, shelves, thisShelf}) => (
    <React.Fragment>
        <h1>{thisShelf.name}</h1>
        <div className='list-books-content'>
            {
                books.map(book => (
                    <div style={{margin: '1vh 1vw 1vh 1vw', padding: 0}} >
                        <Book {...book} shelves={shelves}/>
                    </div>
                ))
            }
        </div>
    </React.Fragment>
)

export default Shelf;