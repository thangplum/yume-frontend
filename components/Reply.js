import React from "react";

const ReplyContainer = ({ children }) => (
  <div className="shadow-md rounded p-4 bg-white">{children}</div>
);

const ReplyAuthor = ({ children }) => (
  <div className="px-4 flex flex-row items-center">{children}</div>
);

const ReplyComment = ({ children }) => (
  <div className="w-full px-4 py-2 mb-2 text-base leading-snug text-gray-800">
    {children}
  </div>
);

const ReplySeparator = () => (
  <div className="mx-4 border border-b-0 border-gray-400"></div>
);

const ReplyActions = ({ children }) => (
  <div className="w-full mt-2 px-4 py-2 flex flex-row justify-between">
    {children}
  </div>
);

function Reply({ comment, author, id, comments, likes }) {
  return (
    <ReplyContainer>
      <ReplyAuthor>
        <p className="font-semibold text-gray-700 leading-tight">
          {author.firstName} {author.lastName}
        </p>
        <p className="font-light text-gray-600 leading-tight ml-2">
          @{author.username}
        </p>
      </ReplyAuthor>
      <ReplyComment>{comment}</ReplyComment>
      <ReplySeparator />
      <ReplyActions>
        <p className="text-base font-medium text-gray-800">
          {comments.length} Comments
        </p>
        <p className="text-sm font-light text-gray-600">{likes} Likes</p>
      </ReplyActions>
    </ReplyContainer>
  );
}

Reply.defaultProps = {
  comment:
    "Lorem aute duis exercitation amet aliqua ea in voluptate laborum. Incididunt ad labore deserunt enim culpa dolore fugiat deserunt exercitation proident tempor. Proident aute labore nulla laboris reprehenderit laborum enim mollit voluptate excepteur laborum fugiat. Culpa ullamco elit dolor esse id. Quis cillum sint nulla consequat labore cupidatat. Consectetur nisi aute ipsum enim deserunt non sint. Ex est pariatur ex officia aliquip et aliquip mollit ea Lorem irure eu voluptate commodo."
};
export default Reply;
