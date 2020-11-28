import { Route, Switch, Redirect } from 'react-router-dom';
import React from 'react';
import LibraryList from './../libraries/LibraryList';
import NewBook from './../books/bookForm/NewBook';
import EditBook from './../books/bookForm/EditBook';
import BookList from './../books/BookList';
import NewLibrary from './../libraries/LibraryForm/NewLibrary';
import EditLibrary from './../libraries/LibraryForm/EditLibrary';
import ProtectedRoute from './../../common/ProtectedRoute';
import ReservationList from './../reservations/ReservationList';
import UserReservationList from './../reservations/UserReservationList';
import NewReservation from './../reservations/ReservationForm/NewReservation';
import EditReservation from './../reservations/ReservationForm/EditReservation';

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
      <ProtectedRoute
        exact
        path="/books/:bookId/edit"
        component={EditBook}
        roles={['Administrator', 'Employee']}
      />
      <ProtectedRoute
        exact
        path="/reservations"
        component={ReservationList}
        roles={['Administrator', 'Employee']}
      />
      <ProtectedRoute
        exact
        path="/reservations/create"
        component={NewReservation}
        roles={['Administrator', 'Employee']}
      />
      <ProtectedRoute
        exact
        path="/reservations/:reservationId/edit"
        component={EditReservation}
        roles={['Administrator', 'Employee']}
      />
      <ProtectedRoute
        exact
        path="/userReservations"
        component={UserReservationList}
        roles={['Administrator', 'Employee', 'User']}
      />
      <Redirect to="/libraries" />
    </Switch>
  );
};

export default Routes;
