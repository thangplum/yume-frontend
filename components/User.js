import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

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
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  return props.children(data);
}

// const signout = async () => {
//   document.cookie = cookie.serialize("token", "", {
//     maxAge: -1 // Expire the cookie immediately
//   });

//   // Force a reload of all the current queries now that the user is
//   // logged in, so we don't accidentally leave any state around.
//   await apolloClient.cache.reset();
//   // Redirect to a more useful page when signed out
//   redirect({}, "/");
// };

export default User;
export { CURRENT_USER_QUERY };
