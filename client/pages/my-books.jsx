import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import DeleteConfirmationModal from '../components/delete-confirmation-modal';

export default class MyBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myBooks: null,
      showDeleteModal: false,
      selectedBookId: null
    };
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.closeDeleteConfirmationModal = this.closeDeleteConfirmationModal.bind(this);
    this.getBooks = this.getBooks.bind(this);
  }

  formatDate(date) {
    const year = date.slice(0, 4);
    const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const month = monthArray[Number(date.slice(5, 7)) - 1];
    const day = date.slice(8, 10);
    const reformattedDate = `${month} ${day}, ${year}`;
    return reformattedDate;
  }

  handleDeleteClick(event) {
    const bookEntry = event.target.closest('li');
    const bookId = parseInt(bookEntry.getAttribute('data-id'));
    this.setState({ showDeleteModal: true, selectedBookId: bookId });
  }

  closeDeleteConfirmationModal() {
    this.setState({ showDeleteModal: false, selectedBookId: null });
  }

  getBooks() {
    const token = window.localStorage.getItem('bookWorm-jwt');
    const init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': `${token}`
      }
    };

    fetch('/api/getAllBooks', init)
      .then(res => res.json())
      .then(books => this.setState({ myBooks: books }))
      .catch(err => {
        console.error(err);
        if (this.context.user) window.alert('Sorry, we are unable to retrieve your books at this time. Please check your internet connection and try again later.');
      });
  }

  componentDidMount() {
    this.getBooks();
  }

  componentDidUpdate() {
    this.getBooks();
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    if (this.state.myBooks === null) return null;

    if (this.state.myBooks.length === 0) {
      return (
        <>
          <h1 className='my-books-heading'>My Books</h1>
          <p className='no-books-text'>No books have been saved. Click search to start your next reading adventure!</p>
        </>
      );
    }
    const books = this.state.myBooks.map(book => {
      const completedDate = (book.completedAt)
        ? (
        <>
          <p className='library-bookshelf-details'>Bookshelf: Read</p>
          <p className='library-date-completed'> Date Completed: {this.formatDate(book.completedAt)}</p>
        </>
          )
        : (
          <>
            <p className='library-bookshelf-details'>Bookshelf: To-Read</p>
            <p className='library-not-completed'> Not yet completed</p>
          </>
          );

      const authorAndYear = (book.author)
        ? (
          <>
              <p className='library-author-date'> {book.author}   &#8226;   {book.publishedYear}</p>
          </>
          )
        : (
          <>
            <p className='library-author-date'> <em>No Author</em>   &#8226;   {book.publishedYear}</p>
          </>
          );

      return (
        <>
          <li key={book.bookId} className='column-one-half column-full my-books-list-items' data-id={book.bookId} >
              <div className='row jusitfy-content-center'>
                <div className='column-flex'>
                  <img className='library-cover-img' src={book.coverImgURL} />
                </div>
                <div className='column-flex library-books-detail-padding'>
                  <p className='library-book-title'> {book.title}</p>
                  {authorAndYear}
                  {completedDate}
                <i className="fa-solid fa-trash-can trash-icon" onClick={this.handleDeleteClick}></i>
                </div>
            </div>
          </li>
        </>
      );
    });

    return (
      <>
        <h1 className='my-books-heading'>My Books</h1>
        <ul className='library-books-list'>
          {books}
        </ul>
        {this.state.showDeleteModal && <DeleteConfirmationModal bookId={this.state.selectedBookId} closeModal={this.closeDeleteConfirmationModal}/>}
      </>
    );
  }
}

MyBooks.contextType = AppContext;
