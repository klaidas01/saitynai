import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import React from 'react';
import LibraryList from './../libraries/LibraryList';
import NewBook from './../books/bookForm/NewBook';
import AllBookList from './../books/AllBookList';

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
      <Route exact path="/books" component={AllBookList} />
      <Route path="/libraries/:libraryId/books" component={AllBookList} />
      <Route exact path="/books/create" component={NewBook} />
      <Redirect to="/libraries" />
    </Switch>
  );
};

export default Routes;
