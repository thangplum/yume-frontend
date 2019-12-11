import React, { useState } from "react";
import { EditorState, RichUtils, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import Editor from "./Editor";
import { stateToHTML } from "draft-js-export-html";
import { INLINE_STYLES, InlineStyleButton } from "./PostEditor";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { GET_POST_FROM_SLUG } from "../pages/post/[slug]";

const CREATE_REPLY_MUTATION = gql`
  mutation CREATE_REPLY_MUTATION($comment: String!, $post: ID!) {
    createReply(comment: $comment, post: $post) {
      id
      comment
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
        height: 160px;
      }
    `}</style>
  </div>
);

function ReplyEditor({ postId, postSlug }) {
  const [createReply] = useMutation(CREATE_REPLY_MUTATION);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

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

    createReply({
      variables: {
        post: postId,
        comment: text
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
