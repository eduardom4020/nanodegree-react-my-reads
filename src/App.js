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
]

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
    value: 'Read',
    name: 'Read'
  },
]

class BooksApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      books: [],
      shelves: initial_shelves
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
    // BooksAPI.getAll() //get all books currently in user's shelves
    // .then(books => {
    //   this.setState({
    //     books: books
    //   })
    // })

    BooksAPI.search(searchTerms[10]).then(res => {this.setState(prevState => ({books: prevState.books.concat(res)}))});
  }
  
  render() {
    return (
      <div className='app'>
        <Route exact path='/' render={() => (
          <MainPage {...this.state} />
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