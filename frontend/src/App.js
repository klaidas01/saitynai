import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './features/navigation/Layout';
import Routes from './features/navigation/Routes';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <Layout>
          <Routes />
        </Layout>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
