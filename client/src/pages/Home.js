import React from 'react';
import ThoughtList from '../components/ThoughtList';
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import Auth from '../utils/auth';
import FriendList from '../components/FriendList';

const Home = () => {
  // use useQuery hook to make an asynchronous query request
  const {
    loading, // indicate that the request isn't done yet
    data, // where the returned data is stored
  } = useQuery(QUERY_THOUGHTS);
  // // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
  const { data: userData } = useQuery(QUERY_ME_BASIC);
  /*
    Optional chaining negates the need to check if an object even exists before accessing its properties. 
    In this case, no data will exist until the query to the server is finished. 
    So if we type data.thoughts, we'll receive an error saying we can't access the property of data—because it is undefined.
  */
  // thoughts will be assigned to an empty array until data is obtained form the server
  const thoughts = data?.thoughts || [];

  // if logged in, the variable will be true
  const loggedIn = Auth.loggedIn();

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {/* once the data becomes defined, then loading becomes undefined, allowing the data to be displayed */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title='Some Feed for Thought(s)...'
            ></ThoughtList>
          )}
        </div>
        {/* display the friends list if the user is logged in */}
        {loggedIn && userData ? (
          <div className='col-12 col-lg-3 mb-3'>
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
