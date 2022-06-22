import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutations';
// because home and profile use different query methods, If you visit the /profile route without first visiting the homepage, QUERY_THOUGHTS will have never been cached, resulting in an error when you try to read and update it.
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {
  const [thoughtText, setText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  // addThought runs the mutation, and error will initially be undefined unless there is an error
  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    // update the cache to contain the newly added thought so it displays right away
    update(cache, { data: { addThought } }) {
      // could potentially not exist yet, so wrap in a try/catch
      try {
        // update the array's cache
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
        });
      } catch (e) {
        console.warn('First thought insertion by user');
      }

      // read what's currently in the cache
      const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
      // add the newest thought to the front of the array
      cache.writeQuery({
        query: QUERY_THOUGHTS,
        data: { thoughts: [addThought, ...thoughts] },
      });
    },
  });

  // the textarea will stop allowing you to type if you hit 280 characters
  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setText(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // add thought to database
      await addThought({
        variables: { thoughtText },
      });
      // clear form value
      setText('');
      setCharacterCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {/* display the character count to the user, and once they hit 280, display an error */}
      <p
        className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}
      >
        Character Count: {characterCount}/280
        {error && <span className='ml-2'>Something went wrong...</span>}
      </p>
      <form
        className='flex-row justify-center justify-space-between-md align-stretch'
        onSubmit={handleFormSubmit}
      >
        <textarea
          placeholder="Here's a new thought..."
          value={thoughtText}
          className='form-input col-12 col-md-9'
          onChange={handleChange}
        ></textarea>
        <button className='btn col-12 col-md-3' type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
