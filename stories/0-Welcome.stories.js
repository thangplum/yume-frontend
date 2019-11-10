import React from "react";
import { linkTo } from "@storybook/addon-links";
import { Welcome } from "@storybook/react/demo";
import IndexPage from "../components/IndexPage";

export default {
  title: "Welcome"
};

export const toStorybook = () => <Welcome showApp={linkTo("Button")} />;

toStorybook.story = {
  name: "to Storybook"
};

export const indexPage = () => <IndexPage />;
