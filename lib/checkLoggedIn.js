import gql from "graphql-tag";
import cookie from "cookie";
import redirect from "./redirect";

const getToken = ctx => {
  let token = null;
  // if context has request info aka Server Side
  if (ctx.req) {
    token = cookie.parse(ctx.req.headers.cookie || "").token;
  } else if (typeof document !== "undefined") {
    token = cookie.parse(document.cookie || "").token;
  }
  return token;
};

const signout = async client => {
  document.cookie = cookie.serialize("token", "", {
    maxAge: -1 // Expire the cookie immediately
  });

  // Reset store and Redirect to a more useful page when signed out
  client.clearStore().then(() => {
    client.resetStore().then(() => {
      redirect({}, "/");
    });
  });
};

export { getToken, signout };

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
