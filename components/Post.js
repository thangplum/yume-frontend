import React, { useState } from "react";
import VoteButton from "./VoteButton";
import gql from "graphql-tag";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import { GET_POST_FROM_SLUG } from "../pages/post/[slug]";
import User, { CURRENT_USER_QUERY } from "./User";
import createAvatar from "../lib/createAvatar";
import Link from "next/link";
import redirect from "../lib/redirect";
import { Router, useRouter } from "next/router";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import FacebookIcon from "../icons/f_logo.png";
import TwitterIcon from "../icons/twitter_logo.svg";
import RenderText from "./RenderText";
import ReportEditor from "./ReportEditor";
import { useToggle } from "../lib/custom-hooks";

const UPVOTE_POST_MUTATION = gql`
  mutation UPVOTE_POST_MUTATION($postId: ID!) {
    upvotePost(id: $postId) {
      id
    }
  }
`;

const DOWNVOTE_POST_MUTATION = gql`
  mutation UPVOTE_POST_MUTATION($postId: ID!) {
    downvotePost(id: $postId) {
      id
    }
  }
`;

const BOOKMARK_POST_MUTATION = gql`
  mutation BOOKMARK_POST_MUTATION($postId: ID!) {
    bookmark(id: $postId) {
      id
    }
  }
`;

const UNBOOKMARK_POST_MUTATION = gql`
  mutation UNBOOKMARK_POST_MUTATION($postId: ID!) {
    unbookmark(id: $postId) {
      id
    }
  }
`;

const DELETE_POST_MUTATION = gql`
  mutation DELETE_POST_MUTATION($postId: ID!) {
    deletePost(id: $postId) {
      id
    }
  }
`;

const PostContainer = ({ children }) => (
  <div className="relative rounded-lg bg-white shadow-lg p-3">{children}</div>
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
  commentRaw,
  upvotes,
  downvotes,
  rating,
  numReplies,
  author
}) {
  const [upvotePost] = useMutation(UPVOTE_POST_MUTATION);
  const [downvotePost] = useMutation(DOWNVOTE_POST_MUTATION);
  const { isOpen: isReportEditorOpen, setIsOpen: setReportEditor } = useToggle(
    false
  );

  const _handleUpVoteClick = () => {
    upvotePost({
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

  const _handleDownVoteClick = () => {
    downvotePost({
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

  //URL from current page
  const url = typeof window !== "undefined" && window.location.href;

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
            <PostComment>
              <RenderText text={comment} rawText={commentRaw} />
            </PostComment>
            <PostSeparator />
            <PostActions>
              <p className="text-lg font-medium text-gray-800">
                {numReplies} Answers
              </p>
              <div className="text-base font-light text-gray-600 flex items-center">
                {me && (
                  <VoteButton
                    handleUpVoteClick={_handleUpVoteClick}
                    handleDownVoteClick={_handleDownVoteClick}
                    upvoted={upvotes}
                    downvoted={downvotes}
                  />
                )}
                <p className="ml-3">{rating} Points</p>
                <FacebookShareButton
                  className="ml-3 outline-none focus:outline-none"
                  url={url}
                  quote={caption}
                >
                  <img src={FacebookIcon} className="w-6" />
                </FacebookShareButton>
                <TwitterShareButton
                  className="ml-3 outline-none focus:outline-none"
                  url={url}
                  title={caption}
                >
                  <img src={TwitterIcon} className="w-6" />
                </TwitterShareButton>
              </div>
            </PostActions>
            {me && (
              <PostOptions
                user={me}
                postId={id}
                postAuthor={author}
                openReportEditor={() => setReportEditor(true)}
              />
            )}
            <ReportEditor
              isEditorOpen={isReportEditorOpen}
              setIsEditorOpen={setReportEditor}
              postId={id}
            />
          </PostContainer>
        );
      }}
    </User>
  );
}

Post.defaultProps = {
  caption: "",
  comment: "",
  rating: 0,
  numReplies: 0
};

function PostOptions({ user, postId, postAuthor, openReportEditor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarkPost] = useMutation(BOOKMARK_POST_MUTATION);
  const [unbookmarkPost] = useMutation(UNBOOKMARK_POST_MUTATION);
  const [deletePost] = useMutation(DELETE_POST_MUTATION);

  const router = useRouter();

  const isBookmarked =
    user.bookmarks.filter(bookmark => bookmark.id === postId).length > 0;

  const _handleBookmarkClick = () => {
    const bookmarkMutation = isBookmarked ? unbookmarkPost : bookmarkPost;
    bookmarkMutation({
      variables: {
        postId
      },
      refetchQueries: [
        {
          query: CURRENT_USER_QUERY
        }
      ]
    });
  };

  const isPostAuthor = user.id === postAuthor.id;
  const _handleDeletePostClick = () => {
    deletePost({
      variables: {
        postId
      }
    }).then(() => {
      // after deleting redirect to profile page
      router.push(`/profile/${user.username}`);
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
        <button
          onMouseDown={_handleBookmarkClick}
          className="flex w-full items-center px-4 pt-3 pb-2 hover:bg-gray-200 cursor-pointer outline-none focus:outline-none"
        >
          <BookmarkSvg isBookmarked={isBookmarked} />{" "}
          {isBookmarked ? "UnBookmark" : "Bookmark"}
        </button>

        <button
          onMouseDown={() => openReportEditor()}
          className="flex w-full items-center px-4 py-2 hover:bg-gray-200 cursor-pointer outline-none focus:outline-none"
        >
          <FlagSvg /> Report
        </button>

        {isPostAuthor && (
          <button
            onMouseDown={_handleDeletePostClick}
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
export default Post;
