import React, {Component} from 'react';
import './styles/mainpage.css';
import Shelf from './shelf';

/**
* @class
* @classdesc This class describes the main page with all of user shelves.
* @type {Component}
*/
class MainPage extends Component {
    componentDidMount() {
        const {refreshBooks} = this.props;

        if(refreshBooks != null) {
            refreshBooks();
        }
    }

    

    render() {
        const {shelves} = this.props;

        return (
            <div className='list-books'>
                <div className='list-books-title'>
                    <h1>MyReads</h1>
                </div>
                {
                    shelves.map((shelf, it) => (
                        <Shelf {...this.props} thisShelf={shelf} key={`shelf${it}`} />
                    ))
                }
            </div>
        )
    }
}

export default MainPage;