import React from "react";
import { action } from "@storybook/addon-actions";
import { Button } from "semantic-ui-react";

export default {
  title: "Button"
};

export const text = () => (
  <Button onClick={action("clicked")}>
    <p className="text-yume-red">Hello Button</p>
  </Button>
);

export const emoji = () => (
  <Button onClick={action("clicked")}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
