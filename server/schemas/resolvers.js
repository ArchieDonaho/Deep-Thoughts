const { Thought, User } = require('../models');

const resolvers = {
  // query contains our functions used by our queries and mutations with the same name
  Query: {
    // get all thoughts or a single thought by user
    thoughts: async (parent, { username }) => {
      // pass in parent and username, parent is a placeholder so we can use username
      // if a query was searched by username, return a query search using the username. else, search for all users
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    // get a single thought by _id
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
    // get all user's
    users: async () => {
      return (
        User.find()
          // omit version and password from being returned
          .select('-__v -password')
          .populate('friends')
          .populate('thoughts')
      );
    },
    // get a single user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
  },
};

module.exports = resolvers;
