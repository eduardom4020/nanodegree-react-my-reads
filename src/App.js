import React, {Component} from 'react';
import * as BooksAPI from './APIClients/BooksAPI';
import './styles/App.css';
import MainPage from './components/mainpage';
import SearchPage from './components/searchpage';
import AddBookButton from './components/btaddbook';
import { Route } from 'react-router-dom';
import { ArrayOfObjectsEquality } from './functions/objectutils';

/**
 * BooksApp
 * @namespace BooksApp
 */

/**
* @description The initial configuration of shelves. 
* Change this to add or remove shelves from your application.
* @constant
* @type {Array}
* @default
*/
const INITIAL_SHELVES = [
	{
		value: 'currentlyReading',
		name: 'Currently Reading'
	},
	{
		value: 'wantToRead',
		name: 'Want To Read'
	},
	{
		value: 'read',
		name: 'Read'
	}
];

/**
* @description The initial configuration of float buttons that moves user to search page. 
* Put the EXACT routes that you wish to appear a button on the application.
* @constant
* @type {Array}
* @default
*/
const ADD_BUTTON_PATHS = [
	'/'
];

/**
* @class
* @classdesc This is the main class that describe the component that cointains the entire
* application. It state contains the info necessary for the application works well. By passing
* down to children these informations and the methods to change then, this class assures that
* all of the information remains consistent at the two pages.
* @type {Component}
*/
class BooksApp extends Component {
	constructor(props) {
		super(props);

		this.state = {
			books: [],
			shelves: INITIAL_SHELVES,
			mounted: false
		};
	}

	/**
	* @description Receives a list of books object (it's only necessary that these objects
	* have an valid ID on BooksAPI) and sets the state of books in BooksApp component.
	* @param {Array} books
	* @returns {null} This method returns nothing.
	*/
	setBooks = books => {
		this.setState({
			books: books
		});
	}

	/**
	* @description Receives a list of books object (it's only necessary that these objects
	* have an valid ID on BooksAPI) and compares with books currently in BooksApp component
	* state.
	* @param {Array} toCompareBooks
	* @returns {Boolean} Returns true if any param or BooksApp books state are null. Also
	* returns true if param does not match with state, otherwise returns false.
	*/
	booksChanged = toCompareBooks => {
		if(toCompareBooks && this.state.books) {
			const nextStateIdShelf = toCompareBooks.map(book => ({[book.id]: book.shelf}));
			const currStateIdShelf = this.state.books.map(book => ({[book.id]: book.shelf}));
			
			return !ArrayOfObjectsEquality(currStateIdShelf, nextStateIdShelf);
		} else {
			return true;
		}
	}

	/**
	* @description Use BooksAPI to get all books on user's shelves. Then sets the BooksApp state
	* with these books.
	* @returns {null} This method returns nothing.
	*/
	refreshBooks = () => {
        BooksAPI.getAll()
		.then(books => {
			this.setBooks(books);
		});
    }

	/**
	* @description Use BooksAPI to move book to none shelf. Then sets the BooksApp state
	* to exclude this book.
	* @param {Book} book
	* @returns {null} This method returns nothing.
	*/
	removeBookFromShelf = book => {
		BooksAPI.update(book, 'none')
		.then(this.setState(prevState => ({
			books: prevState.books.filter(oldStateBook => oldStateBook.id !== book.id)
		})))
	}

	/**
	* @description Use removeBookFromShelf to remove all books from all shelves.
	* @returns {null} This method returns nothing.
	*/
	clearAllShelves = () => {
		this.state.books.forEach(book => {
			this.removeBookFromShelf(book);
		});
	}

	/**
	* @description Get shelf value by passing an index of shelves Array in BooksApp state or a string
	* that is the name of the shelf.
	* @param {(number | string)} shelf
	* @returns {(string | Boolean)} This method returns an string that is the value of that shelf or
	* a boolean always false, that represents that the input name does not exists on shelves.
	*/
	validateAndGetShelfValue = shelf => {
		if(shelf === 'none') {
			return 'none';
		} else if(typeof shelf == 'number') {
			return this.state.shelves[shelf].value;
		} else if(typeof shelf == 'string') { 
			const filterShelves = this.state.shelves.filter(aShelf => aShelf.value === shelf);
			return filterShelves.length > 0 ? shelf : false;
		} else {
			return false;
		}
	} 

	/**
	* @description Use BooksAPI to move a book to some shelf. Then update BooksApp state.
	* @param {Book} book
	* @param {(number | string)} shelf
	* @returns {null} This method returns nothing.
	*/
	moveBookToShelf = (book, shelf) => {
		const shelfValue = this.validateAndGetShelfValue(shelf);
		
		if(shelfValue) { 
			BooksAPI.update(book, shelfValue)
			.then(this.setState(prevState => {
					const booksNewState = prevState.books.map(aBook => aBook.id === book.id ? {...aBook, shelf: shelfValue} : aBook);
					return ({
						books: booksNewState
					})
				})
			)	
		}
	}

	/**
	* @description Use BooksAPI to update a group of books info changing them to some shelf.
	* @param {Array} booksPerShelf
	* @returns {Array} This method returns an array of Promises containing the new state of
	* the moved books.
	*/
	updateGroupOfBooksAPI = booksPerShelf => {
		const result = booksPerShelf.map(async bookToShelf => {
			const shelfValue = this.state.shelves[bookToShelf.toShelf].value;
			await BooksAPI.update(bookToShelf.book, shelfValue);
			return {...bookToShelf.book, shelf: shelfValue};
		});
		return result;
	}

	/**
	* @description Use BooksAPI to move a group of books to some shelf. Then update BooksApp state.
	* @param {Book} book
	* @param {(number | string)} shelf
	* @returns {null} This method returns nothing.
	*/
	moveBooksToShelfByOrder = (books, shelf) => {
		const bookToShelf = books.map(book => ({book: book, toShelf: shelf}));
		const res = this.updateGroupOfBooksAPI(bookToShelf);
		Promise.all(res)
		.then(newBooksState => {
			this.setState({
				books: newBooksState
			});
		});
	}

	//Old way to do the method above

	// moveGroupOfBooksToShelf = (prevState, shelf) => {
	// 	let prevStateIdShelf = prevState.books.map(book => ({[book.id]: book.shelf}))
	// 	prevStateIdShelf = prevStateIdShelf.length > 0 ? prevStateIdShelf.reduce((acc, curr) => ({...acc, ...curr})) : {};
	// 	let currStateIdShelf = this.state.books.map(book => ({[book.id]: book.shelf}))
	// 	currStateIdShelf = currStateIdShelf.length > 0 ? currStateIdShelf.reduce((acc, curr) => ({...acc, ...curr})) : {};

	// 	const booksToMove = Object.keys(currStateIdShelf)
	// 	.filter(key => (
	// 		!prevStateIdShelf.hasOwnProperty(key) || 
	// 		currStateIdShelf[key] == null || (
	// 		prevStateIdShelf.hasOwnProperty(key) && 
	// 		prevStateIdShelf[key] != null && 
	// 		currStateIdShelf[key] !== prevStateIdShelf[key]
	// 		)
	// 	));

	// 	if(booksToMove.length > 0) {
	// 		this.moveBookToShelfByOrder(booksToMove[0], shelf);
	// 	}
	// }
  
	/**
	* @description Refresh books info and sets mounted state to true, that will prevent Main Page
	* to execute refreshBooks method on initial load.
	* @returns {null} This method returns nothing.
	*/
	componentDidMount() {
		this.refreshBooks();
		this.setState({
			mounted: true
		});
	}

	/**
	* @description BooksApp's render. It contains the two pages, uses react router to 
	* render them and the float buttons. The functions and the state are passed down
	* to childrens in this method.
	*/
	render() {
		return (
			<div className='app'>
				<Route exact path='/' render={() => (
						<MainPage 
							{...this.state} 
							setBooks={this.setBooks}
							booksChanged={this.booksChanged}
							moveBookToShelf={this.moveBookToShelf}
							refreshBooks={this.state.mounted ? this.refreshBooks : null}
						/>
					)} 
				/>

				<Route exact path='/search' render={() => (
						<SearchPage 
							{...this.state} 
							moveBookToShelf={this.moveBookToShelf}
						/>
					)} 
				/>

				{
					ADD_BUTTON_PATHS.map((buttonPath, it) => (
						<Route exact path={buttonPath} component={AddBookButton} key={`btPath${it}`}/>
					))
				}
			</div>
		);
	}
}

export default BooksApp;