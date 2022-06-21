import React from 'react';
import {
  ApolloProvider, // special react component that we use to provide data to all of the other components
  ApolloClient, // constructor function that will help initialize the connection to the GraphQL APi server
  InMemoryCache, // enables Apollo client instance to cache API response data
  createHttpLink, // allows us to control how the Apollo client makes a request, like middleware
} from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

// create link to the api
const httpLink = createHttpLink({
  // uri: 'http://localhost:3001/graphql', // the server runs at 3001, and react runs at 3000, thus the reason for an absolute path
  uri: '/graphql', // we use the "proxy" element in package.json to allow us to use relative pathing on production and final development
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    // we contain everything in the ApolloProvider tag so all elements have access to the client tag
    <ApolloProvider client={client}>
      {/* everything wrapped in the Router is aware of the client side routing that can take place */}
      <Router>
        <div className='flex-column justify-flex-start min-100-vh'>
          <Header />
          <div className='container'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/profile'>
                <Route path=':username' element={<Profile />} />
                <Route path='' element={<Profile />} />
              </Route>
              <Route path='/thought/:id' element={<SingleThought />} />
              <Route path='*' element={<NoMatch />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
