import React, { useState } from "react";
import { EditorState, RichUtils, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import Editor from "./Editor";
import { stateToHTML } from "draft-js-export-html";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { getOperationName } from "apollo-link";
import { minLengthForQuestionCaption } from "../config";
import { GET_CATEGORY_POSTS } from "../pages/forum/[slug]";

const CREATE_POST = gql`
  mutation CREATE_POST($caption: String!, $comment: String!, $category: ID!) {
    createPost(caption: $caption, comment: $comment, category: $category) {
      id
      caption
      comment
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

const CategorySelect = ({ subcategories, postCategory, setPostCategory }) => (
  <div className="inline-block relative w-48 text-lg">
    <select
      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      value={postCategory}
      onChange={e => {
        e.preventDefault();
        setPostCategory(e.target.value);
      }}
    >
      {subcategories.map(subcategory => (
        <option key={subcategory.id} value={subcategory.id}>
          {subcategory.name}
        </option>
      ))}
      {/* <option value="Careers">Careers</option> */}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg
        className="fill-current h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
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
    Ask
  </button>
);

function QuestionEditor({ question, setQuestion }) {
  const minLength = minLengthForQuestionCaption;
  const [error, setError] = useState(false);
  const _handleChange = e => {
    e.preventDefault();
    setQuestion(e.target.value);
  };
  const _checkValidation = e => {
    e.preventDefault();
    if (e.target.value.length < minLength) {
      setError(true);
    }
  };
  return (
    <div className="w-full flex flex-col mb-4">
      <p className={"text-yume-red text-xs " + (!error ? " hidden" : "")}>
        Question must have a length of {minLength} letters.
      </p>
      <textarea
        className={
          "w-full resize-none outline-none font-semibold text-2xl text-black leading-snug " +
          (error ? " text-yume-red underline rounded-lg" : "")
        }
        placeholder="Ask a question"
        value={question}
        onChange={_handleChange}
        onBlur={_checkValidation}
        onFocus={() => setError(false)}
      ></textarea>
    </div>
  );
}

function PostEditor({
  isEditorOpen,
  setIsEditorOpen,
  subcategories,
  selectedCategoryId
}) {
  const [createPost] = useMutation(CREATE_POST);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [question, setQuestion] = useState("");
  const [postCategory, setPostCategory] = useState(
    subcategories && subcategories.length ? subcategories[0].id : ""
  );
  const [error, setError] = useState(false);

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

    if (question.length < minLengthForQuestionCaption) return;

    // Note: Here in refetchQueries, since we are using "getOperationName", it will refetch the queries
    // with the variables used to call the query previously
    createPost({
      variables: {
        caption: question,
        comment: text,
        category: postCategory
      },
      refetchQueries: [getOperationName(GET_CATEGORY_POSTS)]
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
      .catch(e => setError(true));
  };

  return (
    <>
      <ModalOverlay isHidden={!isEditorOpen}>
        <Modal>
          <ModalCloseButton setIsEditorOpen={setIsEditorOpen} />
          {error && (
            <p className="text-yume-red text-sm">Error creating post</p>
          )}
          <p className="font-bold text-2xl mb-4">Create question</p>
          <LineSeparator />
          <div className="w-full mb-4 flex items-center">
            <p className="font-semibold text-lg mr-6">Ask in Category </p>
            <CategorySelect
              postCategory={postCategory}
              setPostCategory={setPostCategory}
              subcategories={subcategories}
            />
          </div>
          <LineSeparator />
          <QuestionEditor question={question} setQuestion={setQuestion} />
          <StyledCommentEditor>
            <Editor
              editorState={editorState}
              setEditorState={setEditorState}
              placeholder={"Enter question details"}
            />
          </StyledCommentEditor>
          <InlineStyleControls
            toggleInlineStyle={_toggleInlineStyle}
            currentStyle={currentStyle}
          />
          <StyledSubmitButton handleSubmit={_handleSubmit} />
        </Modal>
      </ModalOverlay>
    </>
  );
}

export { INLINE_STYLES };
const INLINE_STYLES = [
  { label: "Bold", style: "BOLD", name: "bold" },
  { label: "Italic", style: "ITALIC", name: "italic" },
  { label: "Underline", style: "STRIKETHROUGH", name: "strikethrough" },
  { label: "Strikethrough", style: "UNDERLINE", name: "underline" }
];

const InlineStyleControls = ({ toggleInlineStyle, currentStyle }) => {
  return (
    <div className="w-full mt-4 p-2 border rounded-lg bg-grays-100 flex justify-around text-xl">
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

export { InlineStyleButton };
const InlineStyleButton = ({ toggle, name, style, active }) => (
  <button
    data-style={style}
    className={
      "px-3 py-1 hover:text-yume-red " + (active ? "text-yume-red" : "")
    }
    onMouseDown={toggle}
  >
    <i className={"fas fa-" + name}></i>
  </button>
);

export default PostEditor;
