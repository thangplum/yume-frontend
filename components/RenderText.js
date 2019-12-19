import React, { useState } from "react";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import Truncate from "react-truncate-html";

const getHTMLFromRawText = raw_text => {
  const rawObj = JSON.parse(raw_text);
  const contentState = convertFromRaw(rawObj);
  const renderedHTML = stateToHTML(contentState);
  return { __html: renderedHTML };
};

function RenderText({ text, rawText }) {
  if (!rawText) {
    return <div dangerouslySetInnerHTML={{ __html: `<p>${text}</p>` }} />;
  }

  return <div dangerouslySetInnerHTML={getHTMLFromRawText(rawText)} />;
}

export default RenderText;
