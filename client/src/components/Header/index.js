import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className='bg-secondary mb-4 py-2 flex-row align-center'>
      <div className='container flex-row justify-space-between-lg justify-center align-center'>
        {/* Link is like an <a> tag, except it will not refresh the webpage */}
        <Link to='/'>
          <h1>Deep Thoughts</h1>
        </Link>

        <nav className='text-center'>
          <Link to='/login'>Login</Link>
          <Link to='/signup'>Signup</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
