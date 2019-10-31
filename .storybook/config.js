import { configure } from "@storybook/react";

import "../style.css";
import "fomantic-ui-css/semantic.min.css";

// automatically import all files ending in *.stories.js
configure(require.context("../stories", true, /\.stories\.js$/), module);
