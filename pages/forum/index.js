import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import ForumCategory from "../../components/ForumCategory";
import "../../style.css";
import Banner from "../../components/Banner";
import Header from "../../components/Header";

const GET_FORUM_CATEGORIES_QUERY = gql`
  query getForumCategories {
    forumCategories {
      id
      name
      children {
        id
        name
      }
    }
  }
`;
function Forum() {
  const { loading, error, data } = useQuery(GET_FORUM_CATEGORIES_QUERY);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Couldn't load</div>;

  const { forumCategories } = data;
  return (
    <div>
      <div className="container mx-auto">
        <Header />
      </div>
      <Banner title="Welcome to the Best College Forum." />
      <div className="flex flex-wrap mt-6">
        {forumCategories.map(cat => {
          return (
            <div
              key={cat.id}
              className="flex flex-col w-full p-2  sm:w-1/2 md:px-12 mb-4 xl:items-center"
            >
              <ForumCategory name={cat.name} number={10} id={cat.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default withApollo(Forum);
