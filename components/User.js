import gql from "graphql-tag";
import { useQuery, useApolloClient } from "@apollo/react-hooks";

const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    whoami {
      username
      firstName
      lastName
      email
    }
  }
`;

function User(props) {
  const apolloClient = useApolloClient();
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  if (error && error.graphQLErrors) {
    const { message } = error.graphQLErrors[0];
  }
  return props.children(data);
}

export default User;
export { CURRENT_USER_QUERY };
