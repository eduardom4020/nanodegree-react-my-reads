import React from 'react';
import * as BooksAPI from './APIClients/BooksAPI';
import './styles/App.css';
import MainPage from './components/mainpage';
import SearchPage from './components/searchpage';
import AddBookButton from './components/btaddbook';
import addButtonPaths from './static/addbuttonexactpaths.json';
import { Route } from 'react-router-dom';
import { ArrayOfObjectsEquality } from './functions/objectutils';

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

class BooksApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			books: [],
			shelves: INITIAL_SHELVES,
			mounted: false
		};
	}

	setBooks = books => {
		this.setState({
			books: books
		});
	}

	booksChanged = toCompareBooks => {
		if(toCompareBooks && this.state.books) {
			const nextStateIdShelf = toCompareBooks.map(book => ({[book.id]: book.shelf}));
			const currStateIdShelf = this.state.books.map(book => ({[book.id]: book.shelf}));
			
			return !ArrayOfObjectsEquality(currStateIdShelf, nextStateIdShelf);
		} else {
			return true;
		}
	}

	refreshBooks = () => {
        BooksAPI.getAll()
		.then(books => {
			this.setBooks(books);
		});
    }

	addBookToShelf = (book, shelf) => {
		BooksAPI.update(book, shelf)
		.then(this.setState(prevState => ({
			books: prevState.books.concat(book)
		})));
	}

	removeBookFromShelf = book => {
		BooksAPI.update(book, 'none')
		.then(this.setState(prevState => ({
			books: prevState.books.filter(oldStateBook => oldStateBook.id !== book.id)
		})))
	}

	clearAllShelves = () => {
		this.state.books.forEach(book => {
			this.removeBookFromShelf(book);
		});
	}

	updateGroupOfBooksAPI = booksPerShelf => {
		const result = booksPerShelf.map(async bookToShelf => {
			const shelfValue = this.state.shelves[bookToShelf.toShelf].value;
			await BooksAPI.update(bookToShelf.book, shelfValue);
			return {...bookToShelf.book, shelf: shelfValue};
		});
		return result;
	}

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
  
	componentDidMount() {
		this.refreshBooks();
		this.setState({
			mounted: true
		});
	}

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
					addButtonPaths.map((buttonPath, it) => (
						<Route exact path={buttonPath} component={AddBookButton} key={`btPath${it}`}/>
					))
				}
			</div>
		);
	}
}

export default BooksApp;