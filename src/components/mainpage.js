import React from 'react';
import './styles/mainpage.css';
import Shelf from './shelf';

const MainPage = (props) => (
    <div className='list-books'>
        <div className='list-books-title'>
            <h1>MyReads</h1>
        </div>
        {
            props.shelves.map(shelf => (
                <Shelf {...props} thisShelf={shelf} />
            ))
        }
    </div>
)

export default MainPage;