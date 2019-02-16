import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Shelf from './shelf';
import * as BooksAPI from '../APIClients/BooksAPI';

const searchShelf = {
    value: 'ABSTRACT__search',
    name: 'Result'
};

const searchTerms = [
	'Android', 'Art', 'Artificial Intelligence', 'Astronomy', 'Austen', 
	'Baseball', 'Basketball', 'Bhagat', 'Biography', 'Brief', 'Business', 
	'Camus', 'Cervantes', 'Christie', 'Classics', 'Comics', 'Cook', 'Cricket', 'Cycling', 
	'Desai', 'Design', 'Development', 'Digital Marketing', 'Drama', 'Drawing', 'Dumas', 
	'Education', 'Everything', 
	'Fantasy', 'Film', 'Finance', 'First', 'Fitness', 'Football', 'Future', 
	'Games', 'Gandhi', 
	'Homer', 'Horror', 'Hugo', 
	'Ibsen', 'Journey', 
	'Kafka', 'King', 
	'Lahiri', 'Larsson', 'Learn', 'Literary Fiction', 
	'Make', 'Manage', 'Marquez', 'Money', 'Mystery', 
	'Negotiate', 
	'Painting', 'Philosophy', 'Photography', 'Poetry', 'Production', 'Programming', 
	'React', 'Redux', 'River', 'Robotics', 'Rowling', 
	'Satire', 'Science Fiction', 'Shakespeare', 'Singh', 'Swimming', 
	'Tale', 'Thrun', 'Time', 'Tolstoy', 'Travel', 
	'Ultimate', 
	'Virtual Reality', 
	'Web Development', 
	'iOS'
];

class SearchPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            books: [],
            shelves: [
                {
                    value: 'SEARCH__result',
                    name: 'Result'
                }
            ],
            searchText: '',
        };
    }

    dynamicSearch = event => {
        const value = event.target.value;

        if(this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(this.startSearch(value) , 500);
        this.setState({
            searchText: value
        })
    }

    startSearch = value => () => {
        if(value === '') {
            this.setState({
                books: []
            })
        } else {
            BooksAPI.search(value).then(res => {
                const booksTreated = this.treatSearchResult(res);

                this.setState({
                    books: booksTreated
                });
            });
        }
    }

    treatSearchResult = queryRes => {
        if(queryRes.constructor != Array) {
            console.log('QUERY RES IS NOT AN ARRAY', queryRes)
            return [];
        }   

        const {books: shelvesBooks} = this.props;

        const booksRes = queryRes.map(book => {
            const bookFromShelfFilter = shelvesBooks.filter(shelfBook => shelfBook.id == book.id);
            if(bookFromShelfFilter.length > 0) {
                return bookFromShelfFilter[0];
            } else {
                return book;
            }
        });

        return booksRes;
    }

    componentDidMount() {
        this.timer = null;
    }

    render() {
        return (
            <div className='search-books'>
                <div className='search-books-bar'>
                    <Link to='/'>
                        <button className='close-search'>Close</button>
                    </Link>
                    <div className='search-books-input-wrapper'>
                        <input 
                            type='text'
                            value={this.state.searchText}
                            placeholder='Search by title or author'
                            onChange={this.dynamicSearch}
                        />
                    </div>
                </div>
                <div className='search-books-results'>
                {
                    this.state.shelves.map(shelf => (
                        <Shelf 
                            {...this.props}
                            books={this.state.books}
                            thisShelf={shelf}
                            filterFunc={book => book}
                        >
                            <div className='empty-list-books'>
                                <h3>Search Results Nothing</h3>
                                <p>Please make a search using the restricted terms of API using the input above.</p>
                            </div>
                        </Shelf>
                    ))
                }
                </div>
            </div>
        )
    }
}

export default SearchPage;