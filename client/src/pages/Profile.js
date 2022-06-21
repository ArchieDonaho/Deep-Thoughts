import React from 'react';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';

const Profile = () => {
  const { username: userParam } = useParams(); // grab the username from the url

  const { loading, data } = useQuery(QUERY_USER, {
    // using the username, query the user info
    variables: { username: userParam },
  });
  // when the data comes back, asign it to user
  const user = data?.user || {};
  //until then, return a loading text
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className='flex-row mb-3'>
        <h2 className='bg-dark text-secondary p-3 display-inline-block'>
          Viewing {user.username}'s profile
        </h2>
      </div>

      <div className='flex-row justify-space-between mb-3'>
        <div className='col-12 mb-3 col-lg-8'>
          <ThoughtList
            thoughts={user.thoughts}
            title={`${user.username}'s thoughts...`}
          />
        </div>

        <div className='col-12 col-lg-3 mb-3'>
          <FriendList
            friendCount={user.friendCount}
            username={user.username}
            friends={user.friends}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
