import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/index.css';
import { BrowserRouter } from 'react-router-dom';

/**
 * Index
 * @namespace Index
 */

/**
* @description React DOM Initializer.
* @param {ReactDOM, DOM}
*/
ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
, document.getElementById('root'));
