import React, { useState } from "react";
import { EditorState, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import Editor from "./Editor";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const MAX_REPORT_LENGTH = 500;
const MIN_REPORT_LENGTH = 10;

const CREATE_REPORT = gql`
  mutation CREATE_POST($reason: String!, $post: ID!) {
    createFlag(reason: $reason, post: $post) {
      id
      author {
        id
        username
      }
      reason
    }
  }
`;

const ModalOverlay = ({ children, isHidden }) => (
  <div
    className={`${
      isHidden ? "hidden" : ""
    } fixed w-full h-screen inset-0 z-50 overflow-hidden flex justify-center items-center`}
    style={{ backgroundColor: "rgb(255,255,255,0.7)" }}
  >
    {children}
  </div>
);

const Modal = ({ children }) => (
  <div className="modal px-4 py-6 max-w-xl bg-white w-11/12 mx-auto border rounded-lg shadow-lg flex flex-col items-center max-h-full relative">
    {children}
    <style jsx>{`
      .modal {
        max-height: 620px;
      }
    `}</style>
  </div>
);

const ModalCloseButton = ({ setIsEditorOpen }) => (
  <div className="win-close absolute">
    <button onMouseDown={() => setIsEditorOpen(false)}>
      {/* prevent default highlight of button on press */}
      <i className="far fa-window-close text-3xl hover:text-yume-red-darker"></i>
    </button>
    <style jsx>{`
      .win-close {
        top: 20px;
        right: 20px;
      }
    `}</style>
  </div>
);

const LineSeparator = () => (
  <div className="w-full mb-4 border border-b-0 border-gray-400 "></div>
);

const StyledCommentEditor = ({ children }) => (
  <div className="editor w-full overflow-y-auto font-medium text-xl text-black leading-snug">
    {children}
    <style jsx>{`
      .editor {
        min-height: 120px;
      }
    `}</style>
  </div>
);

const StyledSubmitButton = ({ handleSubmit }) => (
  <button
    onClick={handleSubmit}
    className="w-full mt-4 py-3 rounded-lg text-white font-semibold text-lg bg-yume-red hover:bg-yume-red-darker"
  >
    Report
  </button>
);

function ReportEditor({ isEditorOpen, setIsEditorOpen, postId }) {
  const [createReport] = useMutation(CREATE_REPORT);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [error, setError] = useState("");

  const _handleSubmit = e => {
    e.preventDefault();
    setError("");
    const text = editorState.getCurrentContent().getPlainText();

    if (text.length > MAX_REPORT_LENGTH) {
      setError("Max character length exceeded");
      return;
    }

    if (text.length < MIN_REPORT_LENGTH) {
      setError("Min character length is 10");
      return;
    }

    // Note: Here in refetchQueries, since we are using "getOperationName", it will refetch the queries
    // with the variables used to call the query previously
    createReport({
      variables: {
        post: postId,
        reason: text
      }
    })
      .then(data => {
        // reset editor
        const newState = EditorState.push(
          editorState,
          ContentState.createFromText("")
        );
        setEditorState(newState);
        setIsEditorOpen(false);
      })
      .catch(e => {
        const err = JSON.parse(JSON.stringify(e));
        if (err && err.message && err.message.startsWith("GraphQL error:")) {
          setError(err.message.slice(15));
        } else {
          setError("Error creating report");
        }
      });
  };

  return (
    <>
      <ModalOverlay isHidden={!isEditorOpen}>
        <Modal>
          <ModalCloseButton setIsEditorOpen={setIsEditorOpen} />
          {error && <p className="text-yume-red text-sm">{error}</p>}
          <p className="font-bold text-2xl mb-4">Make a report</p>
          <LineSeparator />
          <StyledCommentEditor>
            <Editor
              editorState={editorState}
              setEditorState={setEditorState}
              placeholder={"Enter report details"}
            />
          </StyledCommentEditor>
          <StyledSubmitButton handleSubmit={_handleSubmit} />
        </Modal>
      </ModalOverlay>
    </>
  );
}

export default ReportEditor;
