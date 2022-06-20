const { Thought, User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  // query contains our functions used by our queries with the same name
  Query: {
    // using "context", which contains "context.user" if the user has a valid jwt, return if the user is logged in or not
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({})
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends');

        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
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
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      // check the email
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect Credentials');
      }
      // check the password
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect Credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    addThought: async (parent, args, context) => {
      // if the user lis logged in...
      if (context.user) {
        // create the thought...
        const thought = await Thought.create({
          ...args,
          username: context.user.username,
        });
        // add the thought to the user...
        await User.findByIdAndUpdate(
          { _id: context.user._id }, // where _id = the passed in user id
          { $push: { thoughts: thought._id } }, // add the thought...
          { new: true } // return the updated User...
        );
        // then return the new User
        return thought;
      }
      // if the user is not logged in...
      throw new AuthenticationError('You need to be logged in');
    },
    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      if (context.user) {
        const updatedThought = await Thought.findByIdAndUpdate(
          { _id: thoughtId },
          {
            $push: {
              reactions: { reactionBody, username: context.user.username },
            },
          },
          { new: true, runValidators: true }
        );
        return updatedThought;
      }
      throw new AuthenticationError('You need to be logged in');
    },
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: friendId } }, // here we use addToSet instead of push b/ we don't want duplicate data
          { new: true }
        ).populate('friends');

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in');
    },
  },
};

module.exports = resolvers;
