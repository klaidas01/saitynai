import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import React from 'react';
import LibraryList from './../libraries/LibraryList';
import NewBook from './../books/bookForm/NewBook';
import BookList from './../books/BookList';

const Routes = () => {
  const history = useHistory();

  const RedirectToLibraryBooks = (row) => {
    const path = '/libraries/' + row.id + '/books';
    history.push(path);
  };

  return (
    <Switch>
      <Route
        exact
        path="/libraries"
        render={() => <LibraryList onRowClick={(row) => RedirectToLibraryBooks(row)} />}
      />
      <Route exact path="/books" component={BookList} />
      <Route exact path="/libraries/:libraryId/books" component={BookList} />
      <Route exact path="/books/create" component={NewBook} />
      <Route exact path="/libraries/:libraryId/books/create" component={NewBook} />
      <Redirect to="/libraries" />
    </Switch>
  );
};

export default Routes;
