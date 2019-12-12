import { CURRENT_USER_QUERY } from "../components/User";

export default async apolloClient => {
  try {
    const { data } = await apolloClient.query({
      query: CURRENT_USER_QUERY
    });
    return {
      user: data ? data.whoami : null
    };
  } catch (err) {
    // Fail gracefully
    if (err.graphQLErrors) {
      const { message } = err.graphQLErrors[0];
      return { error: message };
    }
    return {};
  }
};
