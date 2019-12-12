import gql from "graphql-tag";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import getErrorMessage from "../lib/getErrorMessage";

const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    whoami {
      id
      username
      firstName
      lastName
      email
    }
  }
`;

function User(props) {
  const { data, error } = useQuery(CURRENT_USER_QUERY);

  if (error) {
    const message = getErrorMessage(error);
    return props.children({ error: message });
  }
  return props.children({ data });
}

export default User;
export { CURRENT_USER_QUERY };
