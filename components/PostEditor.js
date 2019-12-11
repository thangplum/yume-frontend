import React, { useState } from "react";
import { EditorState, RichUtils, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import Editor from "./Editor";
import { stateToHTML } from "draft-js-export-html";

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

const CategorySelect = () => (
  <div className="inline-block relative w-48 text-lg">
    <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
      <option value="Careers">Careers</option>
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

function QuestionEditor() {
  return (
    <div className="w-full flex mb-4">
      <textarea
        className="w-full resize-none outline-none font-semibold text-2xl text-black leading-snug"
        placeholder="Ask a question"
      ></textarea>
    </div>
  );
}

function PostEditor({ isEditorOpen, setIsEditorOpen }) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const _toggleInlineStyle = evt => {
    evt.preventDefault();
    let style = evt.currentTarget.getAttribute("data-style");
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };
  const currentStyle = editorState.getCurrentInlineStyle();

  const _handleSubmit = e => {
    e.preventDefault();
    const text = editorState.getCurrentContent().getPlainText();
    const convertedHtml = stateToHTML(editorState.getCurrentContent());

    // reset editor
    const newState = EditorState.push(
      editorState,
      ContentState.createFromText("")
    );
    setEditorState(newState);
  };

  return (
    <>
      <ModalOverlay isHidden={!isEditorOpen}>
        <Modal>
          <ModalCloseButton setIsEditorOpen={setIsEditorOpen} />
          <p className="font-bold text-2xl mb-4">Create question</p>
          <LineSeparator />
          <div className="w-full mb-4 flex items-center">
            <p className="font-semibold text-lg mr-6">Ask in Category </p>
            <CategorySelect />
          </div>
          <LineSeparator />
          <QuestionEditor />
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
