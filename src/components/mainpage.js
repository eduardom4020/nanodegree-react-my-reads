import React, {Component} from 'react';
import './styles/mainpage.css';
import Shelf from './shelf';
import * as BooksAPI from '../APIClients/BooksAPI';

class MainPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {refreshBooks} = this.props;

        if(refreshBooks != null) {
            refreshBooks();
        }
    }

    componentDidUpdate() {
        // this.refreshBooks();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
        // if(nextProps == null) {
        //     return true;
        // }

        // const {booksChanged} = this.props;
        // return booksChanged(nextProps.books);
	}

    render() {
        const {shelves} = this.props;

        return (
            <div className='list-books'>
                <div className='list-books-title'>
                    <h1>MyReads</h1>
                </div>
                {
                    shelves.map(shelf => (
                        <Shelf {...this.props} thisShelf={shelf} />
                    ))
                }
            </div>
        )
    }
}

export default MainPage;