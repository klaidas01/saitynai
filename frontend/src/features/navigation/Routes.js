import { Route, Switch, Redirect } from 'react-router-dom';
import React from 'react';
import BookList from './../books/BookList';
import LibraryList from './../libraries/LibraryList';

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/libraries" component={LibraryList} />
      <Route path="/libraries/:libraryId/books" component={BookList} />
      <Redirect to="/libraries" />
    </Switch>
  );
};

export default Routes;
