import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_BASE_URL,
});

const client = new ApolloClient({
  uri: import.meta.env.VITE_BASE_URL,
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

const query = gql`
  query {
    allBooks {
      title
      published
      genres
      author {
        name
        bookCount
        books {
          title
          id
        }
      }
      id
    }
  }
`;

client.query({ query }).then((response) => {
  console.log(response.data);
});

export default client;
