import React from 'react';
import ReactionList from '../components/ReactionList';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client'; // allow us to use our query to retrieve info
import { QUERY_THOUGHT } from '../utils/queries'; // import our query

const SingleThought = (props) => {
  // destructure the parameter info from the url
  const { id: thoughtId } = useParams();

  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId }, // the "id" property becomes the "$id" property on the GraphQL query
  });

  const thought = data?.thought || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className='card mb-3'>
        <p className='card-header'>
          <span style={{ fontWeight: 700 }} className='text-light'>
            {thought.username}
          </span>{' '}
          thought on {thought.createdAt}
        </p>
        <div className='card-body'>
          <p>{thought.thoughtText}</p>
        </div>
      </div>
      {thought.reactionCount > 0 && (
        <ReactionList reactions={thought.reactions} />
      )}
    </div>
  );
};

export default SingleThought;
