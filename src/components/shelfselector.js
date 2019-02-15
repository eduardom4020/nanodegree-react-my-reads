import React from 'react'

const ShelfSelector = ({shelves, moveBookToShelf=null, bookAttached=null}) => (
    <select 
        onChange={ event => (
            bookAttached 
            && moveBookToShelf 
            && moveBookToShelf(bookAttached, event.target.value)
        )}
    >
        <option value='move' disabled>Move to...</option>
        {
            shelves.map(shelf => (
                <option 
                    value={shelf.value}
                    selected={bookAttached.shelf === shelf.value}
                >
                    {shelf.name}
                </option>
            ))
        }
        <option value='none'>None</option>
    </select>
);

export default ShelfSelector;