import withApollo from "next-with-apollo";
import fetch from "isomorphic-unfetch";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { resolvers, defaults } from "./resolvers";
import { setContext } from "apollo-link-context";
import { endpoint, prodEndpoint } from "../config";
import cookie from "js-cookie";
import nextCookie from "next-cookies";

const GRAPHQL_URI =
  process.env.NODE_ENV === "development" ? endpoint : prodEndpoint;

const getAuthCookie = ctx => {
  // if server-side rendering
  if (typeof window === "undefined") {
    return ctx.req.headers.cookie;
  } else {
    // if running on the client browser
    return cookie.get();
  }
};

function createClient({ ctx, headers, initialState }) {
  const cache = new InMemoryCache().restore(initialState || {});
  const fetchOptions = {};
  // If you are using a https_proxy, add fetchOptions with 'https-proxy-agent' agent instance
  // 'https-proxy-agent' is required here because it's a sever-side only module
  if (typeof window === "undefined") {
    if (process.env.https_proxy) {
      fetchOptions.agent = new (require("https-proxy-agent"))(
        process.env.https_proxy
      );
    }
  }

  const httpLink = new HttpLink({
    uri: GRAPHQL_URI,
    credentials: "include",
    fetch,
    fetchOptions
  });

  const authCookie = getAuthCookie(ctx);
  const authLink = setContext((request, { headers }) => {
    return {
      headers: {
        ...headers,
        Cookie: authCookie
      }
    };
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined", // Disables forceFetch on the server (so queries are only run once)
    link: authLink.concat(httpLink),
    cache,
    //local data
    resolvers,
    defaults
  });
}

export default withApollo(createClient, { getDataFromTree: "never" });
