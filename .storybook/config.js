import { configure, addParameters } from "@storybook/react";
import "fomantic-ui-css/semantic.min.css";
import "../style.css";

const newViewports = {
  mobile: {
    name: "Mobile",
    styles: {
      width: "375px",
      height: "800px"
    }
  },
  small: {
    name: "Small",
    styles: {
      width: "640px",
      height: "800px"
    }
  },
  medium: {
    name: "Medium",
    styles: {
      width: "768px",
      height: "800px"
    }
  },
  large: {
    name: "Large",
    styles: {
      width: "1024px",
      height: "800px"
    }
  },
  xlarge: {
    name: "Xlarge",
    styles: {
      width: "1280px",
      height: "800px"
    }
  }
};

addParameters({
  viewport: {
    viewports: newViewports,
    defaultViewport: "responsive"
  }
});

// automatically import all files ending in *.stories.js
configure(require.context("../stories", true, /\.stories\.js$/), module);
