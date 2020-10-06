import { ApolloClient } from '@apollo/client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';

// const httpLink = createHttpLink({
//   uri: process.env.NODE_ENV === 'production' ? 'https://arcane-shelf-79620.herokuapp.com/' : Platform.OS === 'ios' ? 'http://localhost:4000' : 'http://10.0.2.2:4000/',
// });
const httpLink = createHttpLink({
  uri: 'https://arcane-shelf-79620.herokuapp.com/',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default client;
