import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import User from "./User";
import VoteButton from "./VoteButton";
import { GET_POST_FROM_SLUG } from "../pages/post/[slug]";
import createAvatar from "../lib/createAvatar";
import Link from "next/link";
import { useRouter } from "next/router";
import RenderText from "./RenderText";

const UPVOTE_REPLY_MUTATION = gql`
  mutation UPVOTE_REPLY_MUTATION($replyId: ID!) {
    upvoteReply(id: $replyId) {
      id
    }
  }
`;

const DOWNVOTE_REPLY_MUTATION = gql`
  mutation DOWNVOTE_REPLY_MUTATION($replyId: ID!) {
    downvoteReply(id: $replyId) {
      id
    }
  }
`;

const DELETE_REPLY_MUTATION = gql`
  mutation DELETE_REPLY_MUTATION($replyId: ID!) {
    deleteReply(id: $replyId) {
      id
    }
  }
`;

const ReplyContainer = ({ children }) => (
  <div className="relative shadow-md rounded p-3 bg-white">{children}</div>
);

const ReplyAuthor = ({ children }) => (
  <div className="px-3 flex flex-row items-center">{children}</div>
);

const ReplyComment = ({ children }) => (
  <div className="w-full px-3 py-2 mb-2 text-base leading-snug text-gray-800">
    {children}
  </div>
);

const ReplySeparator = () => (
  <div className="mx-4 border border-b-0 border-gray-400"></div>
);

const ReplyActions = ({ children }) => (
  <div className="w-full mt-2 px-4 py-1 flex flex-row justify-between">
    {children}
  </div>
);

function Reply({
  comment,
  commentRaw,
  author,
  id,
  comments,
  upvotes,
  downvotes,
  rating,
  postSlug
}) {
  const [upvoteReply] = useMutation(UPVOTE_REPLY_MUTATION);
  const [downvoteReply] = useMutation(DOWNVOTE_REPLY_MUTATION);

  const _handleUpVoteClick = () => {
    upvoteReply({
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

  const _handleDownVoteClick = () => {
    downvoteReply({
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

  return (
    <User>
      {({ data, error }) => {
        const me = data ? data.whoami : null;
        return (
          <ReplyContainer>
            <ReplyAuthor>
              <div
                className="w-6 h-6 bg-white rounded-lg"
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
            </ReplyAuthor>
            <ReplyComment>
              <RenderText text={comment} rawText={commentRaw} />
            </ReplyComment>
            <ReplySeparator />
            <ReplyActions>
              <p className="text-base font-medium text-gray-800">
                {comments.length} Comments
              </p>
              <div className=" flex items-center text-sm font-light text-gray-600">
                {me && (
                  <VoteButton
                    upvoted={upvotes}
                    downvoted={downvotes}
                    handleUpVoteClick={_handleUpVoteClick}
                    handleDownVoteClick={_handleDownVoteClick}
                  />
                )}
                <p className="ml-2">{rating} Points</p>
              </div>
            </ReplyActions>
            {me && (
              <ReplyOptions
                user={me}
                replyId={id}
                replyAuthor={author}
                postSlug={postSlug}
              />
            )}
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

function ReplyOptions({ user, replyId, replyAuthor, postSlug }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteReply] = useMutation(DELETE_REPLY_MUTATION);

  const router = useRouter();

  const isReplyAuthor = user.id === replyAuthor.id;
  const _handleDeleteReplyClick = () => {
    deleteReply({
      variables: {
        replyId
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
        className="mr-4 mt-2 rounded-full hover:bg-gray-200 p-1 cursor-pointer outline-none focus:outline-none"
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
        {isReplyAuthor && (
          <button
            onMouseDown={_handleDeleteReplyClick}
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
    width="24"
    height="24"
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

const BookmarkSvg = ({ isBookmarked }) => (
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
    className={`${
      isBookmarked ? "fill-current" : ""
    } feather feather-bookmark mr-3`}
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
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
export default Reply;
