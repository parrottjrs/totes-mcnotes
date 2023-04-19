import { home } from "./home.js";
import { note } from "./note.js";

export const pages = {
  /* 
    Page is created based on page type (home, note, etc). 
    home.create() takes a mode such as "grid" or "canvas".
    note.create() takes a note from local storage and
    places it in the quill editor.
    */

  home: home,
  note: note,
};
