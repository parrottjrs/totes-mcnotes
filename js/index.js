import { checkForCoords, currentMode, notes } from "./functions.js";
import { pages } from "./pages/index.js";

pages.home.create(currentMode);

notes.forEach((note) => {
  checkForCoords(note);
});
