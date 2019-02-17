import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Shelf from './shelf';
import * as BooksAPI from '../APIClients/BooksAPI';
import './styles/searchpage.css';

//TODO: Make Extra - autocomplete in search

// const SEARCH_TERMS = [
// 	'Android', 'Art', 'Artificial Intelligence', 'Astronomy', 'Austen', 
// 	'Baseball', 'Basketball', 'Bhagat', 'Biography', 'Brief', 'Business', 
// 	'Camus', 'Cervantes', 'Christie', 'Classics', 'Comics', 'Cook', 'Cricket', 'Cycling', 
// 	'Desai', 'Design', 'Development', 'Digital Marketing', 'Drama', 'Drawing', 'Dumas', 
// 	'Education', 'Everything', 
// 	'Fantasy', 'Film', 'Finance', 'First', 'Fitness', 'Football', 'Future', 
// 	'Games', 'Gandhi', 
// 	'Homer', 'Horror', 'Hugo', 
// 	'Ibsen', 'Journey', 
// 	'Kafka', 'King', 
// 	'Lahiri', 'Larsson', 'Learn', 'Literary Fiction', 
// 	'Make', 'Manage', 'Marquez', 'Money', 'Mystery', 
// 	'Negotiate', 
// 	'Painting', 'Philosophy', 'Photography', 'Poetry', 'Production', 'Programming', 
// 	'React', 'Redux', 'River', 'Robotics', 'Rowling', 
// 	'Satire', 'Science Fiction', 'Shakespeare', 'Singh', 'Swimming', 
// 	'Tale', 'Thrun', 'Time', 'Tolstoy', 'Travel', 
// 	'Ultimate', 
// 	'Virtual Reality', 
// 	'Web Development', 
// 	'iOS'
// ];

//TODO: Make Extra - Create more search shelves and 
//give to the user the capacity to enable or disable them

/**
 * Search Page
 * @namespace SearchPage
 */

/**
* @description The initial configuration of search shelves. 
* These are not user workspace shelfs and will not have durable information.
* @constant
* @type {Array}
* @default
*/
const INITIAL_SEARCH_SHELVES = [
    {
        value: 'SEARCH__result',
        name: 'Result'
    }
];

/**
* @class
* @classdesc This class describes the search page. It contains one or more search shelves.
* The books in it's state will be a combination of books that user has in shelf that matchs
* the search result and books that are not in shelves but match even.
* @type {Component}
*/
class SearchPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            books: [],
            shelves: INITIAL_SEARCH_SHELVES,
            searchText: '',
        };
    }

    /**
    * @description Every time a user writes on input field, this method is called.
    * It sets up a timeout to trigger another method, but if this method is called
    * again, this timeout restart. When user stops writing, the next method is triggered.
	* @param {Object} event
	* @returns {null} This method returns nothing.
	*/
    dynamicSearch = event => {
        const value = event.target.value;

        if(this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(this.execSearch(value) , 500);
        this.setState({
            searchText: value
        })
    }

    /**
    * @description Use the BooksAPI to search all books that match some search term, them set books state.
	* @param {string} value
	* @returns {null} This method returns nothing.
	*/
    execSearch = value => () => {
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

    /**
    * @description Get all books resulting of a search and check if they exists on user's shelves.
    * For them, change the default shelf (None) to the shelf this book is currently inside.
	* @param {?Array} queryRes
	* @returns {Array} This method returns books of search with some changes on shelves if needed.
	*/
    treatSearchResult = queryRes => {
        if(queryRes.constructor !== Array) {
            return [];
        }   

        const {books: shelvesBooks} = this.props;

        const booksRes = queryRes.map(book => {
            const bookFromShelfFilter = shelvesBooks.filter(shelfBook => shelfBook.id === book.id);
            if(bookFromShelfFilter.length > 0) {
                return bookFromShelfFilter[0];
            } else {
                return book;
            }
        });

        return booksRes;
    }
    
    /**
    * @description Create a global timer object. It will be used as search timeout.
	*/
    componentDidMount() {
        this.timer = null;
    }

    /**
    * @description The render method. It contains all of the search tools and a path back
    * to main page. It contains too a list of shelves, that are shelves that contains query results.
	*/
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