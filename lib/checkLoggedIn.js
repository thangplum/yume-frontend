import gql from "graphql-tag";
import cookie from "cookie";
import redirect from "./redirect";
import { CURRENT_USER_QUERY } from "../components/User";

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

  //Reset store and Redirect to a more useful page when signed out
  // Note: client.resetStore() will also refetch all the queries
  // Also: if just want to clear store without refresing queries look at client.clearStore()
  client
    .resetStore()
    .catch(err => {
      // Gracefully catch all the failed auth error as user is not logged In anymore
      return null;
    })
    .finally(() => {
      redirect({}, "/");
    });
};

export { getToken, signout };

export default apolloClient =>
  apolloClient
    .query({
      query: CURRENT_USER_QUERY
    })
    .then(({ data }) => {
      return { data };
    })
    .catch(err => {
      // Fail gracefully
      if (err.graphQLErrors) {
        const { message } = error.graphQLErrors[0];
        return { error: message };
      }
      return {};
    });
