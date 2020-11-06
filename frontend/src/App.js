import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './features/navigation/Layout';
import Routes from './features/navigation/Routes';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
