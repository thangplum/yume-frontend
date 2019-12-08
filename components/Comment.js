import React from "react";

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
  <div className="w-full px-4 flex flex-row justify-end">{children}</div>
);

function Comment({ comment, author, id, likes }) {
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
        <div className="text-xs font-light text-gray-600">{likes} Likes</div>
      </CommentActions>
    </CommentContainer>
  );
}

Comment.defaultProps = {
  comment:
    "Lorem aute duis exercitation amet aliqua ea in voluptate laborum. Incididunt ad labore deserunt enim culpa dolore fugiat deserunt exercitation proident tempor. Proident aute labore nulla laboris reprehenderit laborum enim mollit voluptate excepteur laborum fugiat. Culpa ullamco elit dolor esse id. Quis cillum sint nulla consequat labore cupidatat. Consectetur nisi aute ipsum enim deserunt non sint. Ex est pariatur ex officia aliquip et aliquip mollit ea Lorem irure eu voluptate commodo."
};
export default Comment;
