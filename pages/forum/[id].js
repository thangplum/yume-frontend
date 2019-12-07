import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { withApollo } from "../../lib/apollo";
import {
  ErrorPage,
  ForumPost,
  ForumSubcategory,
  Header,
  LoadingPage
} from "../../components";

const GET_CATEGORY_POSTS = gql`
  query getPostsByCategory($id: ID!) {
    category(id: $id) {
      id
      name
      children {
        id
        name
      }
      posts {
        id
        caption
        comment
        created
        replies {
          id
          comment
        }
        likes
      }
    }
  }
`;

function ForumPosts() {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_CATEGORY_POSTS, {
    variables: { id }
  });

  if (loading) {
    return <LoadingPage />;
  }
  if (error) {
    return <ErrorPage />;
  }

  const { name, children: subcategories, posts } = data.category;

  return (
    <div className="container mx-auto">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <div className="hidden lg:block ml-12 mt-12 flex flex-col items-center">
          <ForumSubcategory title={name} list={subcategories} />
        </div>
        <div className="flex flex-col lg:items-end mt-6">
          {posts.map(post => (
            <div key={post.id} className="mb-6 p-2 lg:w-11/12">
              <ForumPost {...post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withApollo(ForumPosts);
