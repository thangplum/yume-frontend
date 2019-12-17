import React from "react";
import HeartButton from "./HeartButton";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { GET_POST_FROM_SLUG } from "../pages/post/[slug]";
import User from "./User";
import createAvatar from "../lib/createAvatar";
import Link from "next/link";

const LIKE_POST_MUTATION = gql`
  mutation LIKE_POST_MUTATION($postId: ID!) {
    likePost(id: $postId) {
      id
    }
  }
`;

const PostContainer = ({ children }) => (
  <div className="rounded-lg bg-white shadow-lg p-3">{children}</div>
);

const PostAuthor = ({ children }) => (
  <div className="px-4 flex flex-row items-center">{children}</div>
);

const PostCaption = ({ children }) => (
  <div className="px-4 py-2 text-xl font-semibold leading-tight">
    {children}
  </div>
);

const PostComment = ({ children }) => (
  <div className="w-full px-4 py-2 mb-2 text-md leading-snug text-gray-800 ">
    {children}
  </div>
);

const PostSeparator = () => (
  <div className="mx-4 border border-b-0 border-gray-400 "></div>
);

const PostActions = ({ children }) => (
  <div className="w-full mt-2 px-4 py-1 flex flex-row justify-between items-center">
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
              <div
                className="w-8 h-8 bg-white rounded-lg"
                dangerouslySetInnerHTML={createAvatar(author.username)}
              />
              {/* <div> */}
              <Link
                href="/profile/[username]"
                as={`/profile/${author.username}`}
              >
                <a className="font-semibold text-gray-700 leading-none ml-2 cursor-pointer">
                  {author.firstName} {author.lastName}
                </a>
              </Link>
              {/* <p className="font-light text-gray-600 leading-tight ml-2">
                  @{author.username}
                </p> */}
              {/* </div> */}
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
