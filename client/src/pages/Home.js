import React from 'react';
import ThoughtList from '../components/ThoughtList';
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS } from '../utils/queries';

const Home = () => {
  // use useQuery hook to make an asynchronous query request
  const {
    loading, // indicate that the request isn't done yet
    data, // where the returned data is stored
  } = useQuery(QUERY_THOUGHTS);
  /*
    Optional chaining negates the need to check if an object even exists before accessing its properties. 
    In this case, no data will exist until the query to the server is finished. 
    So if we type data.thoughts, we'll receive an error saying we can't access the property of data—because it is undefined.
  */
  // thoughts will be assigned to an empty array until data is obtained form the server
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
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
      </div>
    </main>
  );
};

export default Home;
