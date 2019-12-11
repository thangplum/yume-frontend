import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { GET_POST_FROM_SLUG } from "../pages/post/[slug]";

const CREATE_COMMENT_MUTATION = gql`
  mutation CREATE_COMMENT_MUTATION($comment: String!, $replyId: ID!) {
    createComment(comment: $comment, reply: $replyId) {
      id
      comment
    }
  }
`;

function CommentEditor({ replyId, postSlug }) {
  const minLength = 15;
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION);

  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState(false);

  const _handleChange = e => {
    e.preventDefault();
    setCommentText(e.target.value);
  };

  const _handleSubmit = () => {
    if (commentText.length < minLength) {
      setError(true);
      return;
    }
    createComment({
      variables: {
        replyId,
        comment: commentText
      },
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

  const _checkValidation = () => {
    if (commentText.length && commentText.length < minLength) {
      setError(true);
    }
  };

  return (
    <div className="w-full">
      <p className={"text-yume-red text-xs " + (!error ? " hidden" : "")}>
        Comment must have a length of {minLength} letters.
      </p>
      <div className="flex items-center bg-white">
        <textarea
          className={
            "w-full rounded-lg p-2 pr-6 resize-none outline-none font-normal text-base text-black leading-snug " +
            (error ? " text-yume-red underline rounded-lg" : "")
          }
          placeholder="Write a comment..."
          value={commentText}
          onChange={_handleChange}
          onBlur={_checkValidation}
          onFocus={() => setError(false)}
        ></textarea>
        <div className="h-6 border border-l-0 border-gray-400"></div>
        <button
          onClick={_handleSubmit}
          className="cursor-pointer outline-none focus:outline-none"
        >
          <i className="fas fa-paper-plane text-lg text-yume-red hover:text-yume-red-darker mx-4"></i>
        </button>
      </div>
    </div>
  );
}

export default CommentEditor;
