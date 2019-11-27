import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import "../../style.css";
import Header from "../../components/Header";
import Post from "../../components/Post";
import ErrorPage from "../../components/ErrorPage";
import LoadingPage from "../../components/LoadingPage";

const GET_POST = gql`
  query Post($id: ID!) {
    post(id: $id) {
      id
      caption
      comment
      created
      replies {
        id
        comment
        comments {
          id
          comment
        }
      }
      likes
    }
  }
`;

const Thread = () => {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id }
  });

  if (loading) {
    return <LoadingPage />;
  }
  if (error) return <ErrorPage />;

  const { id: postId, caption, comment, created, replies, likes } = data.post;

  return (
    <div className="container mx-auto">
      <Header />
      <div className="bg-gray-200 p-8 flex items-center justify-center">
        <div className="w-full">
          <Post
            caption={caption}
            comment={comment}
            likes={likes}
            numReplies={replies.length}
          />
        </div>
      </div>

      <div className="bg-gray-400 flex flex-col content-center min-h-screen pl-8">
        {replies.map(reply => (
          <div className="bg-white mt-4 ml-8 p-4 ">{reply.comment}</div>
        ))}
      </div>
    </div>
  );
};

// Post.getInitialProps = async ctx => {
//   const { id } = ctx.query;
//   const client = ctx.apolloClient;
//   try {
//     let { data } = await client.query({
//       query: GET_POST,
//       variables: { id: id }
//     });
//     console.log(data);
//   } catch (e) {
//     console.error(e);
//   }
//   return { id };
// };

export default withApollo(Thread);
