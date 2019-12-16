import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-gridy-sprites";

let options = {};
let avatars = new Avatars(sprites(options));
function createAvatar(username) {
  return { __html: avatars.create(username) };
}

export default createAvatar;
