import withApollo from "next-with-apollo";
import fetch from "isomorphic-unfetch";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { resolvers, defaults } from "./resolvers";
import { setContext } from "apollo-link-context";
import { endpoint, prodEndpoint } from "../config";
import cookie from "cookie";

const GRAPHQL_URI =
  process.env.NODE_ENV === "development" ? endpoint : prodEndpoint;

const getAuthToken = (headers = {}) => {
  // if server-side rendering
  if (typeof window === "undefined" && headers && headers.cookie) {
    const cookies = cookie.parse(headers.cookie);
    return cookies.token;
  } else {
    // if running on the client browser
    const cookies =
      typeof document !== "undefined" ? cookie.parse(document.cookie) : null;
    return cookies ? cookies.token : null;
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
    credentials: "same-origin",
    fetch,
    fetchOptions
  });

  const authToken = getAuthToken(headers);
  const authLink = setContext((request, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : ""
      }
    };
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined", // Disables forceFetch on the server (so queries are only run once)
    link: authLink.concat(httpLink),
    cache,
    //local data
    clientState: {
      resolvers,
      defaults
    }
  });
}

export default withApollo(createClient, { getDataFromTree: "never" });
