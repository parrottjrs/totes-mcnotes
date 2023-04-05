const getNotes = () => {
  const maybeNotes = localStorage.getItem("notes");

  if (maybeNotes === null) {
    return [];
  } else {
    return JSON.parse(maybeNotes);
  }
};

let notes = getNotes();

const getNoteTitle = (note) => {
  if (note.title === "") {
    let title = "";
    let preview = note.content[0].insert;
    console.log(note.content[0].insert);
    for (let i = 0; i < preview.length; i++) {
      title += `${preview[i]}`;
    }
    console.log(note.content[0].insert);
    return `${title}...`;
  }
  return note.title;
};

const saveNote = (updatedNote) => {
  const existing = notes.find((note) => note.id == updatedNote.id);

  if (existing) {
    if (new Date(existing.updated) <= new Date(updatedNote.updated)) {
      existing.title = getNoteTitle(updatedNote);
      existing.content = updatedNote.content;
      existing.color = updatedNote.color;
      existing.updated = updatedNote.updated;
      existing.x = updatedNote.x;
      existing.y = updatedNote.y;
    }
  } else {
    updatedNote.id = Math.floor(Math.random() * 100000);
    notes.unshift(updatedNote);
  }
  localStorage.setItem("notes", JSON.stringify(notes));
};

const deleteNote = (noteToDelete) => {
  notes = notes.filter((note) => note.id != noteToDelete.id);

  localStorage.setItem("notes", JSON.stringify(notes));
  if (currentMode === "grid") {
    changePage("home", "grid");
  } else {
    changePage("home", "canvas");
  }
};

const getDeletedNotes = () => {
  const maybeNotes = localStorage.getItem("deleted-notes");

  if (maybeNotes === null) {
    return [];
  } else {
    return JSON.parse(maybeNotes);
  }
};

let deletedNotes = getDeletedNotes();

const trashNote = (deletedNote) => {
  deletedNotes.unshift(deletedNote);

  localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));
};

const clear = () => {
  header.innerHTML = "";
  container.innerHTML = "";
  timeWrapper.innerHTML = "";
};

const hex2rgb = (hex) => {
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
  setAttributes(fileSelector, { type: "file", id: "file-selector" });
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
        changePage("home");
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

const setAttributes = (elm, attributes) => {
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

const sortNotes = () => {
  const sortMenu = document.querySelector("#sort-menu");
  const noteButtonWrapper = document.querySelector(".wrapper");

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
  noteButtonWrapper.innerHTML = "";

  notes.map((note) => {
    const noteButtonWrapper = document.querySelector(".wrapper");
    const noteElm = document.createElement("button");
    noteElm.classList.add("note-button");
    noteElm.style.backgroundColor = note.color;

    noteElm.addEventListener("click", () => {
      clear();
      pages.note.create(note);
    });

    const noteTitle = document.createElement("p");
    noteTitle.innerText = note.title;
    noteTitle.style.color = hex2rgb(note.color);

    noteElm.appendChild(noteTitle);

    noteButtonWrapper.appendChild(noteElm);
  });
};
