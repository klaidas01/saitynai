import { Route, Switch, Redirect } from 'react-router-dom';
import React from 'react';
import LibraryList from './../libraries/LibraryList';
import NewBook from './../books/bookForm/NewBook';
import BookList from './../books/BookList';
import NewLibrary from './../libraries/LibraryForm/NewLibrary';
import EditLibrary from './../libraries/LibraryForm/EditLibrary';
import ProtectedRoute from './../../common/ProtectedRoute';

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/libraries" component={LibraryList} />
      <Route exact path="/libraries/:libraryId/books" component={BookList} />
      <ProtectedRoute
        exact
        path="/libraries/create"
        component={NewLibrary}
        roles={['Administrator']}
      />
      <ProtectedRoute
        exact
        path="/libraries/:libraryId/edit"
        component={EditLibrary}
        roles={['Administrator']}
      />
      <Route exact path="/books" component={BookList} />
      <ProtectedRoute exact path="/books/create" component={NewBook} roles={['Administrator']} />
      <ProtectedRoute
        exact
        path="/libraries/:libraryId/books/create"
        component={NewBook}
        roles={['Administrator', 'Employee']}
      />
      <Redirect to="/libraries" />
    </Switch>
  );
};

export default Routes;
