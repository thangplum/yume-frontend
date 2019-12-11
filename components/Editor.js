import React from "react";
import { Editor as DraftJsEditor, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";

export default function({ editorState, setEditorState, placeholder }) {
  const _handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };

  return (
    <DraftJsEditor
      editorState={editorState}
      onChange={setEditorState}
      placeholder={placeholder || ""}
      spellCheck={true}
      handleKeyCommand={_handleKeyCommand}
    ></DraftJsEditor>
  );
}
