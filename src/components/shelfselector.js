import React from 'react'

const ShelfSelector = ({shelves}) => (
    <select>
        <option value='move' disabled>Move to...</option>
        {
            shelves.map(shelf => (
                <option value={shelf.value}>{shelf.name}</option>
            ))
        }
        <option value='none'>None</option>
    </select>
);

export default ShelfSelector;