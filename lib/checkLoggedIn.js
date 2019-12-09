import gql from "graphql-tag";

export default apolloClient =>
  apolloClient
    .query({
      query: gql`
        query getUser {
          whoami {
            email
          }
        }
      `
    })
    .then(({ data }) => {
      return { loggedInUser: data };
    })
    .catch(err => {
      // Fail gracefully
      const { graphQLErrors } = err;
      let requestLogin = false;
      for (let error of graphQLErrors) {
        const { message } = error;
        if (message && message.statusCode === 401) {
          // Unauthorized - invalid token or bad token or expired token
          // in this case, request re-login
          requestLogin = true;
        }
      }
      return { loggedInUser: {}, requestLogin };
    });
