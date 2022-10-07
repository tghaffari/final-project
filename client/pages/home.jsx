import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readBooks: null,
      unreadBooks: null
    };
    this.getRecentBooks = this.getRecentBooks.bind(this);
  }

  getRecentBooks() {
    fetch('/api/getRecentBooks')
      .then(res => res.json())
      .then(books => {
        const readBooks = [];
        const unreadBooks = [];
        books.forEach(book => {
          if (book.completedAt !== null) {
            readBooks.unshift(book);
          } else {
            unreadBooks.push(book);
          }
        });
        this.setState({ readBooks, unreadBooks });
      })
      .catch(err => console.error(err));
  }

  componentDidMount() {
    this.getRecentBooks();
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-up" />;

    if (this.state.readBooks === null && this.state.unreadBooks === null) {
      return null;
    }

    let readBookCovers;
    let unreadBookCovers;

    if (this.state.readBooks.length === 0) {
      readBookCovers = (
        <li className='column-full text-align-center placeholder-column-size' key='1'>
          <img className='placeholder-books' src='/images/placeholder_books.png'></img>
          <p className='home-placeholder-text'>Click Search to start adding books to your bookshelf!</p>
        </li>
      );
    } else {
      readBookCovers = this.state.readBooks.map(book => {
        return (
          <li className='column-flex cover-li' key={book.googlId}>
            <img className='home-cover-img' src={book.coverImgURL} />
          </li>
        );
      });
    }

    if (this.state.unreadBooks.length === 0) {
      unreadBookCovers = (
        <li className='column-full text-align-center placeholder-column-size' key='1'>
          <img className='placeholder-books' src='/images/placeholder_books.png'></img>
          <p className='home-placeholder-text'>Click Search to start adding books to your bookshelf!</p>
        </li>
      );
    } else {
      unreadBookCovers = this.state.unreadBooks.map(book => {
        return (
          <li className='column-flex cover-li' key={book.googlId}>
            <img className='home-cover-img' src={book.coverImgURL} />
          </li>
        );
      });
    }

    return (
      <>
        <div className='row text-align-center'>
          <div className='column-full'>
              <a href='#library'><h1 className='home-read-shelf-title'>Read Bookshelf</h1></a>
          </div>
        </div>
        <div className='row'>
          <div className='column-full'>
            <ul className='row read-shelf-list justify-content-evenly'>
              {readBookCovers}
            </ul>
            <div className='row text-align-center'>
              <div className='column-full'>
                <img src='/images/shelf.png' className='read-shelf'></img>
              </div>
            </div>
          </div>
        </div>
        <div className='row text-align-center'>
          <div className='column-full'>
            <a href='#library'><h1 className='home-to-read-shelf-title'>To-Read Bookshelf</h1></a>
          </div>
        </div>
        <div className='row'>
          <div className='column-full'>
            <ul className='row to-read-shelf-list justify-content-evenly'>
              {unreadBookCovers}
            </ul>
            <div className='row text-align-center'>
              <div className='column-full'>
                <img src='/images/shelf.png' className='to-read-shelf'></img>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Home.contextType = AppContext;
