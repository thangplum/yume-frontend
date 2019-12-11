import React, { useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import PostEditor from "../components/PostEditor";

export default {
  title: "Utilities"
};

export const ErrorMessageUtil = () => (
  <ErrorMessage message={"Wrong username/password"} />
);

export function PostEditorUtil() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsEditorOpen(true)}>Open Editor</button>
      <PostEditor
        isEditorOpen={isEditorOpen}
        setIsEditorOpen={setIsEditorOpen}
      />
    </>
  );
}
