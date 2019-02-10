import React from 'react';
import './styles/btaddbook.css';
import { Link } from 'react-router-dom';

const AddBookButton = () => (
    <div className='open-search'>
        <Link to='/search'>
            <button>Add a book</button>
        </Link>
    </div>
);

export default AddBookButton;