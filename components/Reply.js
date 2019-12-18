import React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import User from "./User";
import VoteButton from "./VoteButton";
import { GET_POST_FROM_SLUG } from "../pages/post/[slug]";
import createAvatar from "../lib/createAvatar";
import Link from "next/link";
import ReadMoreReact from 'read-more-react';

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

const ReplyContainer = ({ children }) => (
  <div className="shadow-md rounded p-3 bg-white">{children}</div>
);

const ReplyAuthor = ({ children }) => (
  <div className="px-3 flex flex-row items-center">{children}</div>
);

const ReplyComment = ({ children }) => (
  <div className="w-full px-3 py-2 mb-2 text-base leading-snug text-gray-800">
    <ReadMoreReact text={children} />
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
            <ReplyComment>{comment}</ReplyComment>
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
