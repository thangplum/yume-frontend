import React, { useState } from "react";
import { EditorState, RichUtils, ContentState, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import Editor from "./Editor";
import { stateToHTML } from "draft-js-export-html";
import { INLINE_STYLES, InlineStyleButton } from "./PostEditor";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { GET_POST_FROM_SLUG } from "../pages/post/[slug]";

const MAX_COMMENT_LENGTH = 30000;
const MIN_COMMENT_LENGTH = 20;

const CREATE_REPLY_MUTATION = gql`
  mutation CREATE_REPLY_MUTATION(
    $comment: String!
    $post: ID!
    $commentRaw: String!
  ) {
    createReply(comment: $comment, post: $post, commentRaw: $commentRaw) {
      id
      comment
      commentRaw
    }
  }
`;

const LineSeparator = () => (
  <div className="w-full mb-2 border border-b-0 border-gray-400 "></div>
);

const StyledReplyEditor = ({ children }) => (
  <div className="editor w-full overflow-y-auto font-medium text-xl text-black leading-snug">
    {children}
    <style jsx>{`
      .editor {
        height: 120px;
      }
    `}</style>
  </div>
);

function ReplyEditor({ postId, postSlug }) {
  const [createReply] = useMutation(CREATE_REPLY_MUTATION);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [error, setError] = useState("");

  const currentStyle = editorState.getCurrentInlineStyle();
  const _toggleInlineStyle = evt => {
    evt.preventDefault();
    let style = evt.currentTarget.getAttribute("data-style");
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const _handleSubmit = e => {
    e.preventDefault();
    const text = editorState.getCurrentContent().getPlainText();
    const convertedHtml = stateToHTML(editorState.getCurrentContent());

    if (text.length < MIN_COMMENT_LENGTH) {
      setError(`Min length is ${MIN_COMMENT_LENGTH} characters.`);
      return;
    }
    if (text.length > MAX_COMMENT_LENGTH) {
      setError(`Max length is ${MAX_COMMENT_LENGTH} characters.`);
      return;
    }

    const commentRaw = convertToRaw(editorState.getCurrentContent());
    createReply({
      variables: {
        post: postId,
        comment: text,
        commentRaw: JSON.stringify(commentRaw)
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

  return (
    <>
      {error && <p className="text-xs text-yume-red">{error}</p>}
      <StyledReplyEditor>
        <Editor
          placeholder={"Write a reply"}
          editorState={editorState}
          setEditorState={setEditorState}
        />
      </StyledReplyEditor>
      <LineSeparator />
      <div className="flex items-center mb-3 ">
        <InlineStyleControls
          toggleInlineStyle={_toggleInlineStyle}
          currentStyle={currentStyle}
        />
        <button
          onClick={_handleSubmit}
          className="w-64 py-1 rounded-lg text-white font-semibold text-lg bg-yume-red hover:bg-yume-red-darker"
        >
          Post
        </button>
      </div>
    </>
  );
}

const InlineStyleControls = ({ toggleInlineStyle, currentStyle }) => {
  return (
    <div className="w-full flex items-center">
      {INLINE_STYLES.map((type, index) => (
        <InlineStyleButton
          key={index}
          toggle={toggleInlineStyle}
          {...type}
          active={currentStyle.has(type.style)}
        />
      ))}
    </div>
  );
};
export default ReplyEditor;
