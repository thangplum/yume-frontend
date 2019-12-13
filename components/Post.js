import React from "react";
import HeartButton from "./HeartButton";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { GET_POST_FROM_SLUG } from "../pages/post/[slug]";
import User from "./User";

const LIKE_POST_MUTATION = gql`
  mutation LIKE_POST_MUTATION($postId: ID!) {
    likePost(id: $postId) {
      id
    }
  }
`;

const PostContainer = ({ children }) => (
  <div className="rounded-lg bg-white shadow-lg p-4">{children}</div>
);

const PostAuthor = ({ children }) => (
  <div className="px-4 flex flex-row items-center">{children}</div>
);

const PostCaption = ({ children }) => (
  <div className="px-4 py-2 text-2xl font-semibold leading-tight">
    {children}
  </div>
);

const PostComment = ({ children }) => (
  <div className="w-full px-4 py-2 mb-2 text-lg leading-snug text-gray-800 ">
    {children}
  </div>
);

const PostSeparator = () => (
  <div className="mx-4 border border-b-0 border-gray-400 "></div>
);

const PostActions = ({ children }) => (
  <div className="w-full mt-2 px-4 py-2 flex flex-row justify-between items-center">
    {children}
  </div>
);

function Post({
  id,
  slug,
  caption,
  comment,
  likes,
  numLikes,
  numReplies,
  author
}) {
  const [likePost] = useMutation(LIKE_POST_MUTATION);

  const _handleLikeClick = () => {
    likePost({
      variables: {
        postId: id
      },
      // Need to refetch the posts query to get updated result in the page
      refetchQueries: [
        {
          query: GET_POST_FROM_SLUG,
          variables: {
            slug
          }
        }
      ]
    });
  };

  const _checkIfLiked = user => {
    return likes && likes.filter(liker => liker === user.id)[0];
  };

  return (
    <User>
      {({ data, error }) => {
        const me = data ? data.whoami : null;
        return (
          <PostContainer>
            <PostAuthor>
              <p className="font-semibold text-gray-700 leading-tight">
                {author.firstName} {author.lastName}
              </p>
              <p className="font-light text-gray-600 leading-tight ml-2">
                @{author.username}
              </p>
            </PostAuthor>
            <PostCaption>{caption}</PostCaption>
            <PostComment>{comment}</PostComment>
            <PostSeparator />
            <PostActions>
              <p className="text-lg font-medium text-gray-800">
                {numReplies} Answers
              </p>
              <div className="text-base font-light text-gray-600 flex items-center">
                {me && (
                  <HeartButton
                    isLike={_checkIfLiked(me)}
                    handleClick={_handleLikeClick}
                  />
                )}
                <p className="ml-2">{numLikes} Likes</p>
              </div>
            </PostActions>
          </PostContainer>
        );
      }}
    </User>
  );
}

Post.defaultProps = {
  caption: "",
  comment: "",
  likes: 0,
  numReplies: 0
};

export default Post;
