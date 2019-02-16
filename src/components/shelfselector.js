import React from 'react'

const ShelfSelector = ({shelves, moveBookToShelf=null, bookAttached=null}) => (
    <select 
        onChange={ event => (
            bookAttached 
            && moveBookToShelf 
            && moveBookToShelf(bookAttached, event.target.value)
        )}
        defaultValue={bookAttached.shelf}
    >
        <option value='move' disabled key={'shelfSelectorMoveTo'}>Move to...</option>
        {
            shelves.map((shelf, it) => (
                <option 
                    value={shelf.value}
                    key={`shelfSelectorOption${it}`}
                >
                    {shelf.name}
                </option>
            ))
        }
        <option value='none' key={'shelfSelectorNone'}>None</option>
    </select>
);

export default ShelfSelector;