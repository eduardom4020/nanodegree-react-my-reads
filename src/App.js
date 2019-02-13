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

class BooksApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      books: []
    }
  }

  addBookToShelf = (book, shelf) => {
    BooksAPI.update(book, shelf)
    .then(this.setState(prevState => ({
      books: prevState.books.concat(book)
    })))
  }

  removeBookFromShelf = book => {
    BooksAPI.update(book, 'noShelf')
    .then(this.setState(prevState => ({
      books: prevState.books.filter(oldStateBook => oldStateBook.id != book.id)
    })))
  }

  clearAllShelves = () => {
    this.state.books.forEach(book => {
      this.removeBookFromShelf(book);
    });
  }
  
  componentDidMount() {
    // clearing book shelves
    BooksAPI.getAll() //get all books currently in user's shelves
    .then(books => {
      this.setState({
        books: books
      })
    })
  }
  
  render() {
    return (
      <div className='app'>
        <Route exact path='/' render={() => (
          <MainPage books={this.state.books} />
        )} />
        
        <Route path='/search' component={SearchPage} />

        {
          addButtonPaths.map(buttonPath => (
            <Route exact path={buttonPath} component={AddBookButton} />
          ))
        }
      </div>
    )
  }
}

export default BooksApp;