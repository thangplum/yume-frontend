import React from "react";

const ThumbsUpSvg = ({ filled }) => (
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
    className="feather feather-thumbs-up"
    className={"text-yume-red-darker " + (filled ? " fill-current" : "")}
  >
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
  </svg>
);

const ThumbsDownSvg = ({ filled }) => (
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
    className="feather feather-thumbs-down"
    className={"text-yume-red " + (filled ? " fill-current" : "")}
  >
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
  </svg>
);

function VoteButton({
  upvoted,
  downvoted,
  handleUpVoteClick,
  handleDownVoteClick,
  small
}) {
  return (
    <div className="flex">
      <button
        className="outline-none focus:outline-none mr-2"
        onMouseDown={handleUpVoteClick}
      >
        <ThumbsUpSvg filled={upvoted.length} />
      </button>
      <button
        className="outline-none focus:outline-none"
        onMouseDown={handleDownVoteClick}
      >
        <ThumbsDownSvg filled={downvoted.length} />
      </button>
    </div>
  );
}

VoteButton.defaultProps = {};

export default VoteButton;
