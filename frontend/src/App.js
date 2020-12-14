import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter } from 'react-router-dom';
import Layout from './features/navigation/Layout';
import Routes from './features/navigation/Routes';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <Layout>
          <Helmet>
            <style>{'body { margin: 0; }'}</style>
          </Helmet>
          <Routes />
        </Layout>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
