import React from 'react';
import * as BooksAPI from './APIClients/BooksAPI';
import './styles/App.css';
import MainPage from './components/mainpage';
import SearchPage from './components/searchpage';
import AddBookButton from './components/btaddbook';
import addButtonPaths from './static/addbuttonexactpaths.json';
// TODO: Exclude Link's import when these two components bellow
// were changed to another scripts.
import { Route } from 'react-router-dom';
import { ArrayOfObjectsEquality } from './functions/objectutils'

// TODO: Trim this functional component to a composition of components,
// chaging this for another scripts. The utilization of this now is just
// for test if react router works well. 
// const SearchPageTemporary = () => (
//   <div className='search-books'>
//     <div className='search-books-bar'>
//       <Link to='/'>
//         <button className='close-search'>Close</button>
//       </Link>
//       <div className='search-books-input-wrapper'>
//         {/*
//           NOTES: The search from BooksAPI is limited to a particular set of search terms.
//           You can find these search terms here:
//           https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

//           However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
//           you don't find a specific author or title. Every search is limited by search terms.
//         */}
//         <input type='text' placeholder='Search by title or author'/>

//       </div>
//     </div>
//     <div className='search-books-results'>
//       <ol className='books-grid'></ol>
//     </div>
//   </div>
// )

const initial_shelves = [
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
	},
]

class BooksApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			books: [],
			shelves: initial_shelves,
			mounted: false
		}
	}

	setBooks = books => {
		this.setState({
			books: books
		})
	}

	booksChanged = next_books => {
		if(next_books && this.state.books) {
			const next_state_id_shelf = next_books.map(book => ({[book.id]: book.shelf}));
			const curr_state_id_shelf = this.state.books.map(book => ({[book.id]: book.shelf}));

			console.log(next_state_id_shelf, curr_state_id_shelf)
			
			return !ArrayOfObjectsEquality(curr_state_id_shelf, next_state_id_shelf);
		} else {
			return true;
		}
	}

	refreshBooks = () => {
        BooksAPI.getAll() //get all books currently in user's shelves, only three defaults
		.then(books => {
			this.setBooks(books);
		});
    }

	addBookToShelf = (book, shelf) => {
		BooksAPI.update(book, shelf)
		.then(this.setState(prevState => ({
			books: prevState.books.concat(book)
		})))
	}

	removeBookFromShelf = book => {
		BooksAPI.update(book, 'None')
		.then(this.setState(prevState => ({
			books: prevState.books.filter(oldStateBook => oldStateBook.id != book.id)
		})))
	}

	clearAllShelves = () => {
		this.state.books.forEach(book => {
			this.removeBookFromShelf(book);
		});
	}

	updateGroupOfBooksAPI = books_per_shelf => {
		const result = books_per_shelf.map(async book_to_shelf => {
			const shelf_value = this.state.shelves[book_to_shelf.to_shelf].value;
			await BooksAPI.update(book_to_shelf.book, shelf_value);
			return {...book_to_shelf.book, shelf: shelf_value};
		});
		return result;
	}

	moveBooksToShelfByOrder = (books, shelf) => {
		const books_to_shelf = books.map(book => ({book: book, to_shelf: shelf}));
		const res = this.updateGroupOfBooksAPI(books_to_shelf);
		Promise.all(res)
		.then(new_books_state => {
			this.setState({
				books: new_books_state
			});
		});
	}

	moveBookToShelf = (book, shelf) => {
		console.log('ON MOVE BOOK TO SHELF', book, shelf);
		let shelf_value = 'None';
		if(typeof shelf == 'number') {
			shelf_value = this.state.shelves[shelf].value;
		} else if(typeof shelf == 'string') { 
			const filter_shelves = this.state.shelves.filter(a_shelf => a_shelf.value === shelf);
			if(filter_shelves.length === 0) {
				console.log('invalid shelf passed as params');
				return;
			} else {
				shelf_value = shelf;
			}
		} else {
			return;
		}
		
		BooksAPI.update(book, shelf_value)
		.then(res_book => {
			this.setState(prevState => {
			const books_new_state = prevState.books.map(a_book => a_book.id === book.id ? {...a_book, shelf: shelf_value} : a_book);
			console.log('BOOKS NEW STATE', books_new_state);
			return ({
				books: books_new_state
			})
			})
		})
	}

	moveGroupOfBooksToShelf = (prevState, shelf) => {
		let prev_state_id_shelf = prevState.books.map(book => ({[book.id]: book.shelf}))
		prev_state_id_shelf = prev_state_id_shelf.length > 0 ? prev_state_id_shelf.reduce((acc, curr) => ({...acc, ...curr})) : {};
		let curr_state_id_shelf = this.state.books.map(book => ({[book.id]: book.shelf}))
		curr_state_id_shelf = curr_state_id_shelf.length > 0 ? curr_state_id_shelf.reduce((acc, curr) => ({...acc, ...curr})) : {};

		const books_to_move = Object.keys(curr_state_id_shelf)
		.filter(key => (
			!prev_state_id_shelf.hasOwnProperty(key) || 
			curr_state_id_shelf[key] == null || (
			prev_state_id_shelf.hasOwnProperty(key) && 
			prev_state_id_shelf[key] != null && 
			curr_state_id_shelf[key] !== prev_state_id_shelf[key]
			)
		));

		// console.log('BOOKS TO MOVE', books_to_move, prev_state_id_shelf, curr_state_id_shelf);

		if(books_to_move.length > 0) {
			this.moveBookToShelfByOrder(books_to_move[0], shelf);
		}
	}
  
	componentDidMount() {
	// 	// clearing book shelves
		// BooksAPI.getAll() //get all books currently in user's shelves
		// .then(books => {
		// 	console.log('INITIAL BOOKS!', books)
		// 	this.setState({
		// 		books: books
		// 	});
		// });

	// 	this.clearAllShelves()
		this.refreshBooks();
		this.setState({
			mounted: true
		});
	}

  // TODO: need to put this logic and group of books movement onanother component
	

	componentDidUpdate(prevProps, prevState) {
		// this.clearAllShelves()
		// const books = this.state.books;
		// this.moveBooksToShelfByOrder(books, 0);

		// this.moveGroupOfBooksToShelf(prevState, 0);
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
					addButtonPaths.map(buttonPath => (
						<Route exact path={buttonPath} component={AddBookButton} />
					))
				}
			</div>
		);
	}
}

export default BooksApp;