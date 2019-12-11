import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import User from "./User";
import HeartButton from "./HeartButton";
import { GET_POST_FROM_SLUG } from "../pages/post/[slug]";

const LIKE_COMMENT_MUTATION = gql`
  mutation LIKE_COMMENT_MUTATION($commentId: ID!) {
    likeComment(id: $commentId) {
      id
    }
  }
`;

const CommentContainer = ({ children }) => (
  <div className="bg-white mb-2 py-2 px-2 rounded-lg">{children}</div>
);

const CommentAuthor = ({ children }) => (
  <div className="w-full px-4 flex flex-row items-center">{children}</div>
);

const CommentText = ({ children }) => (
  <div className="w-full px-4 text-sm leading-snug text-gray-700 font-medium">
    {children}
  </div>
);

const CommentActions = ({ children }) => (
  <div className="w-full px-4 mt-1 flex flex-row justify-end items-center">
    {children}
  </div>
);

function Comment({ comment, author, id, likes, numLikes, postSlug }) {
  const [likeComment] = useMutation(LIKE_COMMENT_MUTATION);

  const _handleLikeClick = () => {
    likeComment({
      variables: {
        commentId: id
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
          <CommentContainer>
            <CommentAuthor>
              <p className="font-semibold text-xs text-gray-700 leading-tight">
                {author.firstName} {author.lastName}
              </p>
              <p className="font-light text-xs text-gray-600 leading-tight ml-2">
                @{author.username}
              </p>
            </CommentAuthor>
            <CommentText>{comment}</CommentText>
            <CommentActions>
              {me && (
                <HeartButton
                  isLike={_checkIfLiked(me)}
                  handleClick={_handleLikeClick}
                  small
                />
              )}
              <div className="text-xs font-light text-gray-600 ml-1">
                {numLikes} Likes
              </div>
            </CommentActions>
          </CommentContainer>
        );
      }}
    </User>
  );
}

Comment.defaultProps = {
  comment:
    "Lorem aute duis exercitation amet aliqua ea in voluptate laborum. Incididunt ad labore deserunt enim culpa dolore fugiat deserunt exercitation proident tempor. Proident aute labore nulla laboris reprehenderit laborum enim mollit voluptate excepteur laborum fugiat. Culpa ullamco elit dolor esse id. Quis cillum sint nulla consequat labore cupidatat. Consectetur nisi aute ipsum enim deserunt non sint. Ex est pariatur ex officia aliquip et aliquip mollit ea Lorem irure eu voluptate commodo."
};
export default Comment;
