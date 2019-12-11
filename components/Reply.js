import React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import User from "./User";
import HeartButton from "./HeartButton";
import { GET_POST_FROM_SLUG } from "../pages/post/[slug]";

const LIKE_REPLY_MUTATION = gql`
  mutation LIKE_REPLY_MUTATION($replyId: ID!) {
    likeReply(id: $replyId) {
      id
    }
  }
`;

const ReplyContainer = ({ children }) => (
  <div className="shadow-md rounded p-4 bg-white">{children}</div>
);

const ReplyAuthor = ({ children }) => (
  <div className="px-4 flex flex-row items-center">{children}</div>
);

const ReplyComment = ({ children }) => (
  <div className="w-full px-4 py-2 mb-2 text-base leading-snug text-gray-800">
    {children}
  </div>
);

const ReplySeparator = () => (
  <div className="mx-4 border border-b-0 border-gray-400"></div>
);

const ReplyActions = ({ children }) => (
  <div className="w-full mt-2 px-4 py-2 flex flex-row justify-between">
    {children}
  </div>
);

function Reply({ comment, author, id, comments, likes, numLikes, postSlug }) {
  const [likeReply] = useMutation(LIKE_REPLY_MUTATION);

  const _handleLikeClick = () => {
    likeReply({
      variables: {
        replyId: id
      },
      // Need to refetch the posts query to get updated result in the page
      refetchQueries: [
        {
          query: GET_POST_FROM_SLUG,
          variables: {
            slug: postSlug
          }
        }
      ]
    });
  };

  const _checkIfLiked = user => {
    return likes && likes.filter(liker => liker.id === user.id).length;
  };

  return (
    <User>
      {({ data, error }) => {
        const me = data ? data.whoami : null;
        return (
          <ReplyContainer>
            <ReplyAuthor>
              <p className="font-semibold text-gray-700 leading-tight">
                {author.firstName} {author.lastName}
              </p>
              <p className="font-light text-gray-600 leading-tight ml-2">
                @{author.username}
              </p>
            </ReplyAuthor>
            <ReplyComment>{comment}</ReplyComment>
            <ReplySeparator />
            <ReplyActions>
              <p className="text-base font-medium text-gray-800">
                {comments.length} Comments
              </p>
              <div className=" flex items-center text-sm font-light text-gray-600">
                {me && (
                  <HeartButton
                    isLike={_checkIfLiked(me)}
                    handleClick={_handleLikeClick}
                  />
                )}
                <p className="ml-2">{numLikes} Likes</p>
              </div>
            </ReplyActions>
          </ReplyContainer>
        );
      }}
    </User>
  );
}

Reply.defaultProps = {
  comment:
    "Lorem aute duis exercitation amet aliqua ea in voluptate laborum. Incididunt ad labore deserunt enim culpa dolore fugiat deserunt exercitation proident tempor. Proident aute labore nulla laboris reprehenderit laborum enim mollit voluptate excepteur laborum fugiat. Culpa ullamco elit dolor esse id. Quis cillum sint nulla consequat labore cupidatat. Consectetur nisi aute ipsum enim deserunt non sint. Ex est pariatur ex officia aliquip et aliquip mollit ea Lorem irure eu voluptate commodo."
};
export default Reply;
