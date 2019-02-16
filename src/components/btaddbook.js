import React from 'react';
import './styles/btaddbook.css';
import { Link } from 'react-router-dom';

/**
* @class
* @classdesc This class describes the float button that has a link to search page.
* @type {Component}
*/
const AddBookButton = () => (
    <div className='open-search'>
        <Link to='/search'>
            <button>Add a book</button>
        </Link>
    </div>
);

export default AddBookButton;