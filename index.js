import {
  currentMode,
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
} from "./functions.js";

import { CanvasNote, canvasNoteFromCoords } from "./canvas.js";

import {
  NOTE_COLOR,
  NOTE_X,
  NOTE_Y,
  NOTE_WIDTH,
  NOTE_HEIGHT,
} from "./intro-note.js";

const body = document.querySelector("body");
const header = document.createElement("header");
header.setAttribute("id", "header");
const container = document.createElement("section");
container.setAttribute("id", "container");

const timeStampDiv = document.createElement("div");
timeStampDiv.setAttribute("id", "time-stamp-div");

body.append(header, container);
container.insertAdjacentElement("beforebegin", timeStampDiv);

const pages = {
  /* 
  Page is created based on page type (home, note, etc). 
  home.create() takes a mode such as "grid" or "canvas".
  note.create() takes a note from local storage and
  places it in the quill editor.
  */

  home: {
    create(mode) {
      if (!currentMode) {
        mode = "grid";
      }
      createIntroNote();

      const headerText = document.createElement("h1");
      headerText.innerText = "Notes";

      const newNoteButton = components.moveButton("+ new note", () =>
        changePage("note")
      );

      const exportButton = components.moveButton("export", () =>
        exportNote(JSON.stringify(notes), "Totes McNotes")
      );

      const importButton = components.moveButton("import", () => {
        importTotesMcNotes();
      });

      const modeButton = components.moveButton("change mode", () => {
        if (currentMode === "grid") {
          setCurrentMode("canvas");
          changePage("home", currentMode);
        } else {
          setCurrentMode("grid");
          changePage("home", currentMode);
        }
      });

      header.append(
        headerText,
        newNoteButton,
        importButton,
        exportButton,
        modeButton
      );

      if (mode === "grid") {
        const sortMenu = document.createElement("select");
        sortMenu.setAttribute("id", "sort-menu");
        sortMenu.value = "<--select an option-->";
        sortMenu.addEventListener("change", () => {
          sortAndMapNotes();
        });
        const labelForSortMenu = document.createElement("label");
        setMultipleAttributes(labelForSortMenu, {
          for: "#sort-menu",
          class: "label-for-sort-menu",
        });
        labelForSortMenu.innerText = "Sort Notes By:";
        timeStampDiv.append(labelForSortMenu, sortMenu);

        createSortMethod("<--select an option-->");
        createSortMethod("Date Updated: new to old");
        createSortMethod("Date Updated: old to new");
        createSortMethod("Date Created: new to old");
        createSortMethod("Date Created: old to new");

        const noteButtonDiv = document.createElement("div");
        noteButtonDiv.classList.add("note-button-div");

        container.append(noteButtonDiv);

        sortAndMapNotes();
      } else {
        const canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height =
          window.innerHeight - header.clientHeight - timeStampDiv.clientHeight;
        const c = canvas.getContext("2d");
        container.append(canvas);

        const canvasNotes = notes.map((note) => CanvasNote(canvas, c, note));

        let currentNote = undefined;
        let mouseIsDown = false;

        let start = { x: undefined, y: undefined };
        let mouse = { x: undefined, y: undefined };
        let direction = { x: undefined, y: undefined };

        /*
        mousedown and mousemove have offsets on 
        start.x and start.y to account for header,
        timeStampDiv, and border added to timeStampDiv
        */

        canvas.addEventListener("mousedown", (event) => {
          event.preventDefault();

          start.x = event.clientX + 7;
          start.y =
            event.clientY -
            header.clientHeight -
            timeStampDiv.clientHeight -
            12;

          const canvasNote = canvasNoteFromCoords(
            canvasNotes,
            start.x,
            start.y
          );

          currentNote = canvasNote;
          mouseIsDown = true;
          canvasNotes.push(
            canvasNotes.splice(canvasNotes.indexOf(currentNote), 1)[0]
          );
        });

        window.addEventListener("mouseup", (event) => {
          if (!currentNote) {
            return;
          }
          event.preventDefault();
          saveNote({
            id: currentNote.note.id,
            moved: (currentNote.note.moved = new Date().toLocaleString(
              "en-US"
            )),
            x: currentNote.note.x,
            y: currentNote.note.y,
          });
          if (
            start.x < currentNote.note.x + 14 &&
            start.x > currentNote.note.x &&
            start.y < currentNote.note.y + 14 &&
            start.y > currentNote.note.y
          ) {
            clear();
            pages.note.create(currentNote.note);
          }
          currentNote = undefined;
          mouseIsDown = false;
        });

        canvas.addEventListener("mouseout", (event) => {
          if (!currentNote) {
            return;
          }
          event.preventDefault();
          if (mouseIsDown) {
            return;
          }
          currentNote = undefined;
        });

        canvas.addEventListener("mousemove", (event) => {
          if (!currentNote) {
            return;
          }
          event.preventDefault();

          mouse.x = event.clientX + 7;
          mouse.y =
            event.clientY -
            header.clientHeight -
            timeStampDiv.clientHeight -
            12;

          direction.x = mouse.x - start.x;
          direction.y = mouse.y - start.y;

          currentNote.note.x += direction.x;
          currentNote.note.y += direction.y;

          currentNote.update();

          start.x = mouse.x;
          start.y = mouse.y;
        });

        window.addEventListener("resize", () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          animate();
        });

        const animate = () => {
          const requestAnimationFrame = window.requestAnimationFrame(animate);

          if (canvasNotes.length === 0) {
            window.cancelAnimationFrame(requestAnimationFrame);
          }

          c.clearRect(0, 0, innerWidth, innerHeight);

          for (let i = 0; i < canvasNotes.length; i++) {
            canvasNotes[i].update();
          }
        };
        animate();
      }
    },
  },
  note: {
    create(note) {
      const moveButton = components.moveButton("back", () => {
        changePage("home", currentMode);
      });

      const titleInput = document.createElement("input");
      setMultipleAttributes(titleInput, {
        type: "text",
        placeholder: "My New Note...",
      });
      titleInput.classList.add("title-input");

      const saveButton = document.createElement("button");
      saveButton.classList.add("edit-button");

      const quillDiv = document.createElement("div");
      quillDiv.setAttribute("id", "quill-div");
      quillDiv.style.backgroundColor = NOTE_COLOR;
      quillDiv.style.color = "#000000";

      container.append(quillDiv);

      const quill = new Quill(quillDiv, { theme: "snow" });

      const toolBar = document.querySelector(".ql-toolbar.ql-snow");
      toolBar.style.backgroundColor = NOTE_COLOR;
      toolBar.style.border = "0";

      const colorPicker = document.createElement("input");
      setMultipleAttributes(colorPicker, {
        id: "color-picker",
        type: "color",
        value: NOTE_COLOR,
      });
      colorPicker.addEventListener("change", () => {
        const colorPicker = document.getElementById("color-picker");
        const quillDiv = document.getElementById("quill-div");
        quillDiv.style.backgroundColor = colorPicker.value;
        quillDiv.style.color = checkFontContrast(colorPicker.value);
        toolBar.style.backgroundColor = colorPicker.value;
      });

      if (note) {
        const timeStamp = document.createElement("p");
        timeStamp.innerText = `Created On: ${note.created} ---- Last Edit: ${note.updated}`;
        timeStampDiv.append(timeStamp);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerText = "delete";
        deleteButton.addEventListener("click", () => {
          deleteNote(note);
        });
        container.append(saveButton, deleteButton);

        titleInput.value = note.title;
        colorPicker.value = note.color;
        quill.setContents(note.content);
        toolBar.style.backgroundColor = note.color;
        quillDiv.style.backgroundColor = note.color;
        quillDiv.style.color = checkFontContrast(note.color);

        saveButton.innerText = "save";
        saveButton.addEventListener("click", () => {
          saveNote({
            id: note.id,
            title: titleInput.value,
            content: quill.getContents().ops,
            color: colorPicker.value,
            created: note.created,
            updated: new Date().toLocaleString("en-US"),
            moved: note.moved,
            x: note.x,
            y: note.y,
            width: note.width,
            height: note.height,
          });
          changePage("home", currentMode);
        });
      } else {
        saveButton.innerText = "create";
        saveButton.addEventListener("click", () => {
          saveNote({
            title: titleInput.value,
            content: quill.getContents().ops,
            color: colorPicker.value,
            created: new Date().toLocaleString("en-US"),
            updated: new Date().toLocaleString("en-US"),
            moved: new Date().toLocaleString("en-US"),
            x: NOTE_X,
            y: NOTE_Y,
            width: NOTE_WIDTH,
            height: NOTE_HEIGHT,
          });
          changePage("home", currentMode);
        });
        container.append(saveButton);
      }
      header.append(titleInput, moveButton);
      container.prepend(colorPicker);
    },
  },
  trash: {
    create() {
      const headerText = document.createElement("h1");
      headerText.innerText = "Trash";

      const moveButton = components.moveButton("back", () =>
        changePage("home", currentMode)
      );

      const noteButtonDiv = document.createElement("div");
      noteButtonDiv.classList.add("note-button-div");

      header.append(headerText, moveButton);
      container.append(noteButtonDiv);

      deletedNotes.map((note) => {
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
    },
  },
};
pages.home.create(currentMode);

export { currentMode, notes, timeStampDiv, pages };
