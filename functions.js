import { introNote, timeStampDiv, pages } from "./parent-module.js";

let currentMode = localStorage.currentMode;

const getNotes = () => {
  const maybeNotes = localStorage.getItem("notes");

  if (maybeNotes === null) {
    return [];
  } else {
    return JSON.parse(maybeNotes);
  }
};

let notes = getNotes();

const noteTitleFromContent = (note) => {
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

const saveNote = (updatedNote) => {
  const existing = notes.find((note) => note.id == updatedNote.id);

  if (existing) {
    if (new Date(existing.updated) <= new Date(updatedNote.updated)) {
      existing.title = noteTitleFromContent(updatedNote);
      existing.content = updatedNote.content;
      existing.color = updatedNote.color;
      existing.updated = updatedNote.updated;
      existing.x = updatedNote.x;
      existing.y = updatedNote.y;
    }
  } else {
    updatedNote.title = noteTitleFromContent(updatedNote);
    updatedNote.id = Math.floor(Math.random() * 100000);
    notes.unshift(updatedNote);
  }
  localStorage.setItem("notes", JSON.stringify(notes));
};

const deleteNote = (noteToDelete) => {
  notes = notes.filter((note) => note.id != noteToDelete.id);
  localStorage.setItem("notes", JSON.stringify(notes));
  deletedNotes.unshift(noteToDelete);
  localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));

  if (currentMode === "grid") {
    changePage("home", currentMode);
  } else {
    changePage("home", currentMode);
  }
};

const getDeletedNotes = () => {
  const maybeNotes = localStorage.getItem("deletedNotes");

  if (maybeNotes === null) {
    return [];
  } else {
    return JSON.parse(maybeNotes);
  }
};

let deletedNotes = getDeletedNotes();

const clear = () => {
  header.innerHTML = "";
  container.innerHTML = "";
  timeStampDiv.innerHTML = "";
};

const checkFontContrast = (hex) => {
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

const exportNote = (content, fileName, contentType) => {
  const noteToDownload = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  noteToDownload.href = URL.createObjectURL(file);
  noteToDownload.download = fileName;
  noteToDownload.click();
};

const importTotesMcNotes = () => {
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

const components = {
  moveButton(text, onClick) {
    const moveButton = document.createElement("button");
    moveButton.innerText = text;
    moveButton.classList.add("move-button");
    moveButton.addEventListener("click", onClick);
    return moveButton;
  },
};

const setMultipleAttributes = (elm, attributes) => {
  for (const key in attributes) {
    elm.setAttribute(key, attributes[key]);
  }
};

const changePage = (pageKey, mode) => {
  clear();
  pages[pageKey].create(mode);
};

const createSortMethod = (selection) => {
  const sortMenu = document.querySelector("#sort-menu");
  const option = document.createElement("option");
  option.setAttribute("value", selection);
  option.innerText = selection;
  sortMenu.append(option);
};

const sortAndMapNotes = () => {
  if (currentMode === "canvas") {
    notes = notes.sort((a, b) =>
      new Date(a.moved) < new Date(b.moved) ? -1 : 1
    );
    return notes;
  }
  const sortMenu = document.querySelector("#sort-menu");
  const noteButtonDiv = document.querySelector(".note-button-div");

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
  noteButtonDiv.innerHTML = "";

  notes.map((note) => {
    const noteButtonDiv = document.querySelector(".note-button-div");
    const noteElm = document.createElement("button");
    noteElm.classList.add("note-button");
    noteElm.style.backgroundColor = note.color;

    noteElm.addEventListener("click", () => {
      clear();
      pages.note.create(note);
    });

    const noteTitle = document.createElement("p");
    noteTitle.innerText = note.title;
    noteTitle.style.color = checkFontContrast(note.color);

    noteElm.appendChild(noteTitle);

    noteButtonDiv.appendChild(noteElm);
  });
};

const setCurrentMode = (mode = "grid") => {
  localStorage.setItem("currentMode", mode);
  currentMode = mode;
};

const createIntroNote = () => {
  if (notes.length === 0 && deletedNotes.length === 0) {
    saveNote(introNote);
  }
};

export {
  currentMode,
  getNotes,
  notes,
  saveNote,
  deleteNote,
  deletedNotes,
  clear,
  checkFontContrast,
  exportNote,
  importTotesMcNotes,
  components,
  setMultipleAttributes,
  changePage,
  createSortMethod,
  sortAndMapNotes,
  setCurrentMode,
  createIntroNote,
};
