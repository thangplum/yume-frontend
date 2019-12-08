import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import {
  Banner,
  ErrorPage,
  ForumCategory,
  LoadingPage
} from "../../components";

const GET_FORUM_CATEGORIES_QUERY = gql`
  query getForumCategories {
    forumCategories {
      id
      name
      slug
      children {
        id
        name
        slug
      }
    }
  }
`;
function Forum() {
  const { loading, error, data } = useQuery(GET_FORUM_CATEGORIES_QUERY);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  const { forumCategories } = data;
  return (
    <div>
      <Banner title="Welcome to the Best College Forum." />
      <div className="flex flex-wrap mt-6">
        {forumCategories.map(cat => {
          return (
            <div
              key={cat.id}
              className="flex flex-col w-full p-2  sm:w-1/2 md:px-12 mb-4 xl:items-center"
            >
              <ForumCategory
                name={cat.name}
                number={cat.children.length}
                id={cat.id}
                slug={cat.slug}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default withApollo(Forum);
