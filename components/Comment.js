import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import User from "./User";
import { GET_POST_FROM_SLUG } from "../pages/post/[slug]";
import createAvatar from "../lib/createAvatar";
import Link from "next/link";

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
