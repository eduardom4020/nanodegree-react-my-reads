import React from 'react';
import './styles/book.css';
import ShelfSlector from './shelfselector';

const Book = ({thisBook, moveBookToShelf=null, shelves=null}) => (
    <div className='book'>
        <div className='book-top'>
            <div className='book-cover' 
                style={{ 
                    backgroundImage: `url("${thisBook.imageLinks ? thisBook.imageLinks.thumbnail : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAABQUlEQVR4Ae3bQWrCQBiG4dnZRa6gTSG7SEm//xBeSNftTjxCcwiF1n09gjmBVxCh2I1Ol6GQRWDSTALv+x1geGC2vyMiImrTfKqVDnY2/88766DVfOq6LE9sp7v5/qa77fLEdVM2UWW+/6nKJq6LVJqPM5UuPGW6RQPclLnQbG0+4tYuNB1jAlS50OwaE2Df4QD/d65lXREAAADQFAAAAAAAAAAAAAAAAAAAAAAAQJHa3vZFOkpA+qBX/Zg3b1e9ZZORAbTQyXw9nbQYDeD5SR9Nz+mzSAcOqD9Ow+rPNFxA/XGaVn+mAQHiDgAAAAAiDAAAAAAAAAAAAAAAAAAAAAAAAAAAAJeogAsnKNpEBWxcaC+PMc+wbObC03s0QNnVKeIx6ilieHmibd/HoNrmiesym9myn3Nc+7Jlu79PRET0C5GC9waPZG+fAAAAAElFTkSuQmCC'}")` 
                }}>
            </div>
            {
                moveBookToShelf && (
                    <div className='book-shelf-changer'>
                        <ShelfSlector 
                            shelves={shelves} 
                            moveBookToShelf={moveBookToShelf}
                            bookAttached={thisBook}
                        />
                    </div>
                )
            }
        </div>
        <div className='book-title'>{thisBook.title}</div>
        <div className='book-authors'>{thisBook.authors}</div>
    </div>
);

export default Book;