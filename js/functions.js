import { timeStampDiv } from "./consts.js";
import { pages } from "./pages/index.js";
import { introNote } from "./intro-note.js";

export let currentMode = localStorage.currentMode || "grid";

export const getNotes = () => {
  const maybeNotes = localStorage.getItem("notes");

  if (maybeNotes === null) {
    return [];
  } else {
    return JSON.parse(maybeNotes);
  }
};

export let notes = getNotes();

export const noteTitleFromContent = (note) => {
  if (note.title === "") {
    let title = "";
    let preview = note.content[0].insert;
    for (let i = 0; i < preview.length; i++) {
      if (preview[i] === "\n") {
        title += " ";
      }
      title += preview[i];
    }
    return `${title}`;
  }
  return note.title;
};

export const saveNote = (updatedNote) => {
  const existing = notes.find((note) => note.id == updatedNote.id);

  if (existing) {
    if (new Date(existing.updated) <= new Date(updatedNote.updated)) {
      existing.title = noteTitleFromContent(updatedNote);
      existing.content = updatedNote.content;
      existing.color = updatedNote.color;
      existing.updated = updatedNote.updated;
      existing.moved = updatedNote.moved;
      existing.x = updatedNote.x;
      existing.y = updatedNote.y;
      existing.width = updatedNote.width;
      existing.height = updatedNote.height;
    }
  } else {
    updatedNote.title = noteTitleFromContent(updatedNote);
    updatedNote.id = Math.floor(Math.random() * 100000);
    notes.unshift(updatedNote);
  }
  localStorage.setItem("notes", JSON.stringify(notes));
};

export const deleteNote = (noteToDelete) => {
  if (currentMode === "trash") {
    // removes note from deletedNotes. Used for both permanently
    // deleting and restoring note to saved notes list

    deletedNotes = deletedNotes.filter((note) => note.id != noteToDelete.id);
    localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));
    console.log(currentMode);
  } else {
    notes = notes.filter((note) => note.id != noteToDelete.id);
    localStorage.setItem("notes", JSON.stringify(notes));
    deletedNotes.unshift(noteToDelete);
    localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));
  }
  changePage("home", currentMode);
};

export const deleteConfirmation = (note) => {
  const response = confirm(
    "This will permanently delete your note. If you click ok, your note will never see the sun again."
  );

  if (response) {
    deleteNote(note);
  } else {
    //nothing
  }
};

export const getDeletedNotes = () => {
  const maybeNotes = localStorage.getItem("deletedNotes");

  if (maybeNotes === null) {
    return [];
  } else {
    return JSON.parse(maybeNotes);
  }
};

export let deletedNotes = getDeletedNotes();

export const clear = () => {
  header.innerHTML = "";
  container.innerHTML = "";
  timeStampDiv.innerHTML = "";
};

export const checkFontContrast = (hex) => {
  const rgb = [
    `0x${hex[1]}${hex[2]}` | 0,
    `0x${hex[3]}${hex[4]}` | 0,
    `0x${hex[5]}${hex[6]}` | 0,
  ];
  if (rgb[0] + rgb[1] + rgb[2] <= 150) {
    return "#ffffff";
  } else {
    return "#000000";
  }
};

export const exportNote = (content, fileName, contentType) => {
  const noteToDownload = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  noteToDownload.href = URL.createObjectURL(file);
  noteToDownload.download = fileName;
  noteToDownload.click();
};

export const importTotesMcNotes = () => {
  const fileSelector = document.createElement("input");
  setMultipleAttributes(fileSelector, { type: "file", id: "file-selector" });
  container.append(fileSelector);

  fileSelector.addEventListener("change", () => {
    const fileToImport = document.querySelector("#file-selector");
    const [file] = fileToImport.files;
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        const newNotes = JSON.parse(reader.result);
        for (let i = 0; i < newNotes.length; i++) {
          saveNote(newNotes[i]);
        }
        if (currentMode === "grid") {
          changePage("home", currentMode);
        } else {
          changePage("home", currentMode);
        }
      },
      false
    );

    if (file) {
      reader.readAsText(file);
    }
  });
  fileSelector.click();
};

export const components = {
  button(text, onClick, cl = "button") {
    const button = document.createElement("button");
    button.innerText = text;
    button.classList.add(cl);
    button.addEventListener("click", onClick);
    return button;
  },
};

export const setMultipleAttributes = (elm, attributes) => {
  for (const key in attributes) {
    elm.setAttribute(key, attributes[key]);
  }
};

export const changePage = (pageKey, mode) => {
  clear();
  pages[pageKey].create(mode);
};

export const createSortMethod = (selection) => {
  const sortMenu = document.querySelector("#sort-menu");
  const option = document.createElement("option");
  option.setAttribute("value", selection);
  option.innerText = selection;
  sortMenu.append(option);
};

export const sortNotes = () => {
  const sortMenu = document.querySelector("#sort-menu");

  if (
    sortMenu.value === "Date Updated: new to old" ||
    sortMenu.value === "<--select an option-->"
  ) {
    notes.sort((a, b) => (new Date(a.updated) > new Date(b.updated) ? -1 : 1));
  } else if (sortMenu.value === "Date Created: new to old") {
    notes.sort((a, b) => (new Date(a.created) > new Date(b.created) ? -1 : 1));
  } else if (sortMenu.value === "Date Created: old to new") {
    notes.sort((a, b) => (new Date(a.created) < new Date(b.created) ? -1 : 1));
  } else if (sortMenu.value === "Date Updated: old to new") {
    notes.sort((a, b) => (new Date(a.updated) < new Date(b.updated) ? -1 : 1));
  }
};

export const mapNotes = (notesList) => {
  const noteButtonDiv = document.querySelector(".note-button-div");
  noteButtonDiv.innerHTML = "";

  notesList.map((note) => {
    const noteButtonDiv = document.querySelector(".note-button-div");

    const noteElm = components.button(
      "",
      () => {
        clear();
        pages.note.create(note);
      },
      "note-button"
    );

    noteElm.style.backgroundColor = note.color;

    const noteTitle = document.createElement("p");
    noteTitle.innerText = note.title;
    noteTitle.style.color = checkFontContrast(note.color);

    noteElm.appendChild(noteTitle);

    noteButtonDiv.appendChild(noteElm);
  });
};

export const setCurrentMode = (mode = "grid") => {
  localStorage.setItem("currentMode", mode);
  currentMode = mode;
};

export const createIntroNote = () => {
  if (notes.length === 0 && deletedNotes.length === 0) {
    saveNote(introNote);
  }
};

export const checkForCoords = (note) => {
  const x = note.hasOwnProperty("x");

  if (!x) {
    saveNote({
      id: note.id,
      title: note.title,
      content: note.content,
      color: note.color,
      created: note.created,
      updated: new Date().toLocaleString("en-US"),
      moved: new Date().toLocaleString("en-US"),
      x: NOTE_X,
      y: NOTE_Y,
      width: NOTE_WIDTH,
      height: NOTE_HEIGHT,
    });
  }
};

export function randomInteger(max) {
  return Math.floor(Math.random() * (max + 1));
}

export function randomColor() {
  let hex1 = randomInteger(255).toString(16);
  let hex2 = randomInteger(255).toString(16);
  let hex3 = randomInteger(255).toString(16);

  let myColor = `#${hex1}${hex2}${hex3}`;

  // color picker doesn't like when hex != rrggbb

  if (myColor.length < 7) {
    myColor = randomColor();
  }

  return myColor;
}
