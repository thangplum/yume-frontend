import React from "react";
import ErrorMessage from "../components/ErrorMessage";

export default {
  title: "Utilities"
};

export const ErrorMessageUtil = () => (
  <ErrorMessage message={"Wrong username/password"} />
);
