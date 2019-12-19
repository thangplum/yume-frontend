import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import User from "./User";
import { GET_POST_FROM_SLUG } from "../pages/post/[slug]";
import createAvatar from "../lib/createAvatar";
import Link from "next/link";
import { useRouter } from "next/router";

const DELETE_COMMENT_MUTATION = gql`
  mutation DELETE_COMMENT_MUTATION($commentId: ID!) {
    deleteComment(id: $commentId) {
      id
    }
  }
`;

const CommentContainer = ({ children }) => (
  <div className="relative bg-white mb-2 py-2 px-2 rounded-lg">{children}</div>
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

function Comment({ comment, author, id, postSlug }) {
  return (
    <User>
      {({ data, error }) => {
        const me = data ? data.whoami : null;
        return (
          <CommentContainer>
            <CommentAuthor>
              <div
                className="w-4 h-4 bg-white rounded-lg"
                dangerouslySetInnerHTML={createAvatar(author.username)}
              />

              <Link
                href="/profile/[username]"
                as={`/profile/${author.username}`}
              >
                <a className="font-semibold text-gray-700 leading-none ml-2 cursor-pointer text-xs">
                  {author.firstName} {author.lastName}
                </a>
              </Link>
            </CommentAuthor>
            <CommentText>{comment}</CommentText>
            {me && (
              <CommentOptions
                user={me}
                commentId={id}
                commentAuthor={author}
                postSlug={postSlug}
              />
            )}
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

function CommentOptions({ user, commentId, commentAuthor, postSlug }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION);
  const router = useRouter();

  const isCommentAuthor = user.id === commentAuthor.id;
  const _handleDeleteCommentClick = () => {
    deleteComment({
      variables: {
        commentId: commentId
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

  return (
    <div className="absolute top-0 right-0 flex flex-col items-end">
      <button
        onMouseDown={e => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className=" rounded-full hover:bg-gray-200 mr-2 mt-1 cursor-pointer outline-none focus:outline-none"
      >
        <ViewMoreSvg />
      </button>
      <div
        onMouseDown={() => setIsOpen(false)}
        className={
          (!isOpen ? "hidden " : "") +
          " bg-white rounded shadow-md border z-10 mr-4 mt-2"
        }
      >
        <button className="flex w-full items-center px-4 pt-3 pb-2 hover:bg-gray-200 cursor-pointer outline-none focus:outline-none">
          <FlagSvg /> Report
        </button>
        {isCommentAuthor && (
          <button
            onMouseDown={_handleDeleteCommentClick}
            className="flex w-full items-center px-4 pt-2 pb-3 hover:bg-gray-200 cursor-pointer outline-none focus:outline-none text-red-800"
          >
            <DeleteSvg />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

const ViewMoreSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-more-horizontal text-gray-700"
  >
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

const FlagSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-flag mr-3"
  >
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
    <line x1="4" y1="22" x2="4" y2="15"></line>
  </svg>
);

const DeleteSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-trash-2 mr-3"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);
export default Comment;
