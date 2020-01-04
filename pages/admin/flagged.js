import React from "react";
import gql from "graphql-tag";

const GET_ALL_FLAGS_QUERY = gql`
  query GET_ALL_FLAGS_QUERY {
    flags {
      id
    }
  }
`;

function Flagged({ flags, error }) {
  if (error) return null;

  return <p>ZZZ{JSON.stringify(flags)}</p>;
}

Flagged.getInitialProps = async ctx => {
  try {
    const result = await ctx.apolloClient.query({
      query: GET_ALL_FLAGS_QUERY
    });
    const { flags } = result.data;
    return { flags };
  } catch {
    return { error: true };
  }
};

export default Flagged;
