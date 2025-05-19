import React from 'react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import { DocumentProvider } from './contexts/DocumentContext';
import { UIProvider } from './contexts/UIContext';

function App() {
  return (
    <DocumentProvider>
      <UIProvider>
        <Layout>
          <Home />
        </Layout>
      </UIProvider>
    </DocumentProvider>
  );
}

export default App;