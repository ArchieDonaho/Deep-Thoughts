import React from 'react';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';
import Auth from '../utils/auth';
import {
  useParams,
  Navigate, // redirects a user to another route within the application
} from 'react-router-dom';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { ADD_FRIEND } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';

const Profile = () => {
  // destructure the addFriend to be used in a click function
  const [addFriend] = useMutation(ADD_FRIEND);

  const { username: userParam } = useParams(); // grab the username from the url

  // if there is a parameter containing a username (like if we were viewing another profile) query that
  // else, if there is no query parameter, that means we are on "/profile" and we need to query our data
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    // using the username, query the user info
    variables: { username: userParam },
  });

  // when the data comes back, assign it to user if its a user, or me if its out profile
  const user = data?.me || data?.user || {};

  // navigate to personal profile page if usernamne is the logged in user's
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to='/profile' />;
  }

  //until then, return a loading text
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links
        above to sign up or log in!
      </h4>
    );
  }

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className='flex-row mb-3'>
        <h2 className='bg-dark text-secondary p-3 display-inline-block'>
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>

        {/* render the button if the user is not on their profile */}
        {userParam && (
          <button className='btn ml-auto' onClick={handleClick}>
            Add Friend
          </button>
        )}
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
      <div className='mb-3'>{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
