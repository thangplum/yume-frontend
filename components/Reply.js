import React from "react";

function Reply({ comment }) {
  return <div className="max-w-sm shadow p-4">{comment}</div>;
}

Reply.defaultProps = {
  comment: ""
};
export default Reply;
