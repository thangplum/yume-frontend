import { useMutation, useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";
import cookie from "cookie";
import redirect from "../lib/redirect";

import { withApollo } from "../lib/apollo";
import LoginForm from "../components/LoginForm";

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      token
    }
  }
`;

function Login() {
  const client = useApolloClient();
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted({ login }) {
      // Store the token in cookie
      document.cookie = cookie.serialize("token", login.token, {
        sameSite: true,
        path: "/",
        maxAge: 30 * 24 * 60 * 60 // 30 days
      });
      // Force a reload of all the current queries now that the user is
      // logged in
      client.cache.reset().then(() => {
        redirect({}, "/");
      });
    }
  });

  const handleLogin = (email, password) => {
    login({
      variables: {
        email,
        password
      }
    });
  };

  if (loading) return <div>Loading</div>;
  if (error) return <p>An error occurred</p>;

  return (
    <div className="flex h-screen justify-center items-center">  
      <LoginForm handleLogin={handleLogin} />
    </div>
    
  );
}

// class Login extends Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <div className="container mx-auto">
//         <LoginForm />
//       </div>
//     );
//   }
// }

export default withApollo(Login);
