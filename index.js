import {
  currentMode,
  notes,
  saveNote,
  deleteNote,
  deleteConfirmation,
  deletedNotes,
  clear,
  checkFontContrast,
  exportNote,
  importTotesMcNotes,
  components,
  setMultipleAttributes,
  changePage,
  createSortMethod,
  sortNotes,
  mapNotes,
  setCurrentMode,
  createIntroNote,
  NOTE_COLOR,
  NOTE_X,
  NOTE_Y,
  NOTE_WIDTH,
  NOTE_HEIGHT,
  CanvasNote,
  TrashBin,
  canvasNoteFromCoords,
  checkForCoords,
  randomColor,
} from "./parent-module.js";

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

      const newNoteButton = components.button("+ new note", () =>
        changePage("note")
      );

      const exportButton = components.button("export", () =>
        exportNote(JSON.stringify(notes), "Totes McNotes.json")
      );

      const importButton = components.button("import", () => {
        importTotesMcNotes();
      });

      const modeButton = components.button(
        `change to ${currentMode === "grid" ? "canvas" : "grid"}`,
        () => {
          if (currentMode === "grid") {
            setCurrentMode("canvas");
            changePage("home", currentMode);
          } else {
            setCurrentMode("grid");
            changePage("home", currentMode);
          }
        }
      );

      const trashButton = components.button("recently deleted", () => {
        changePage("home", "trash");
      });

      header.append(
        headerText,
        newNoteButton,
        importButton,
        exportButton,
        modeButton
      );

      if (mode === "grid") {
        const sortMenuDiv = document.createElement("div");

        const sortMenu = document.createElement("select");
        sortMenu.setAttribute("id", "sort-menu");
        sortMenu.value = "<--select an option-->";
        sortMenu.addEventListener("change", () => {
          sortNotes();
          mapNotes(notes);
        });
        const labelForSortMenu = document.createElement("label");
        setMultipleAttributes(labelForSortMenu, {
          for: "#sort-menu",
          class: "label-for-sort-menu",
        });
        labelForSortMenu.innerText = "Sort Notes By:";
        sortMenuDiv.append(labelForSortMenu, sortMenu);
        timeStampDiv.append(sortMenuDiv, trashButton);

        createSortMethod("<--select an option-->");
        createSortMethod("Date Updated: new to old");
        createSortMethod("Date Updated: old to new");
        createSortMethod("Date Created: new to old");
        createSortMethod("Date Created: old to new");

        const noteButtonDiv = document.createElement("div");
        noteButtonDiv.classList.add("note-button-div");

        container.append(noteButtonDiv);

        mapNotes(notes);
      } else if (mode === "canvas") {
        const canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height =
          window.innerHeight - header.clientHeight - timeStampDiv.clientHeight;
        const c = canvas.getContext("2d");
        container.append(canvas);

        const canvasNotes = notes.map((note) => CanvasNote(canvas, c, note));

        const trashBin = TrashBin(canvas, c, deletedNotes);

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

          //keeps animation from running needlessly

          if (!currentNote) {
            return;
          }

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
            //detects mouse on + button

            start.x < currentNote.note.x + 14 &&
            start.x > currentNote.note.x &&
            start.y < currentNote.note.y + 14 &&
            start.y > currentNote.note.y
          ) {
            clear();
            pages.note.create(currentNote.note);
          }
          if (
            // detects mouse on trash bin

            mouse.x > canvas.clientWidth / 2 - 20 &&
            mouse.x < canvas.clientWidth / 2 + 20 &&
            mouse.y > canvas.clientHeight - 100 &&
            mouse.y < canvas.clientHeight
          ) {
            deleteNote(currentNote.note);
            currentNote = undefined;
            mouseIsDown = false;
          }

          currentNote = undefined;
          mouseIsDown = false;
        });

        canvas.addEventListener("dblclick", (event) => {
          event.preventDefault();

          if (
            start.x > canvas.clientWidth / 2 - 20 &&
            start.x < canvas.clientWidth / 2 + 20 &&
            start.y > canvas.clientHeight - 100 &&
            start.y < canvas.clientHeight
          ) {
            setCurrentMode("trash");
            changePage("home", "trash");
          }
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
          canvas.height =
            window.innerHeight -
            header.clientHeight -
            timeStampDiv.clientHeight;

          animate();
        });

        const animate = () => {
          window.requestAnimationFrame(animate);

          c.clearRect(0, 0, innerWidth, innerHeight);

          trashBin.draw();

          for (let i = 0; i < canvasNotes.length; i++) {
            canvasNotes[i].update();
          }
        };

        animate();
      } else {
        header.innerHTML = "";
        const headerText = document.createElement("h1");
        headerText.innerText = "Recently Deleted";

        const backButton = components.button("home", () => {
          setCurrentMode("grid");
          changePage("home", "grid");
        });

        const noteButtonDiv = document.createElement("div");
        noteButtonDiv.classList.add("note-button-div");

        header.append(headerText, backButton);
        container.append(noteButtonDiv);

        mapNotes(deletedNotes);
      }
    },
  },
  note: {
    create(note) {
      const backButton = components.button("back", () => {
        changePage("home", currentMode);
      });

      const titleInput = document.createElement("input");
      setMultipleAttributes(titleInput, {
        type: "text",
        placeholder: "My New Note...",
      });
      titleInput.classList.add("title-input");

      const colorPickerDiv = document.createElement("div");

      const quillDiv = document.createElement("div");
      quillDiv.setAttribute("id", "quill-div");
      quillDiv.style.backgroundColor = NOTE_COLOR;
      quillDiv.style.color = "#000000";

      container.append(colorPickerDiv, quillDiv);

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

      const randomColorButton = components.button("Random Color", () => {
        const myColor = randomColor();

        colorPicker.value = myColor;
        quillDiv.style.backgroundColor = myColor;
        quillDiv.style.color = checkFontContrast(myColor);
        toolBar.style.backgroundColor = myColor;
      });

      if (note) {
        const timeStamp = document.createElement("p");
        timeStamp.innerText = `Created On: ${note.created} ---- Last Edit: ${note.updated}`;
        timeStampDiv.append(timeStamp);

        let saveButtonText = undefined;
        if (currentMode !== "trash") {
          saveButtonText = "save";
        } else {
          saveButtonText = "restore";
        }

        const saveButton = components.button(
          saveButtonText,
          () => {
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
            if (currentMode === "trash") {
              deleteNote(note);
            }
            changePage("home", currentMode);
          },
          "save-button"
        );

        const deleteButton = components.button(
          "delete",
          () => {
            if (currentMode === "trash") {
              deleteConfirmation(note);
            } else {
              deleteNote(note);
            }
          },
          "delete-button"
        );
        container.append(saveButton, deleteButton);

        titleInput.value = note.title;
        colorPicker.value = note.color;
        quill.setContents(note.content);
        toolBar.style.backgroundColor = note.color;
        quillDiv.style.backgroundColor = note.color;
        quillDiv.style.color = checkFontContrast(note.color);
      } else {
        const saveButton = components.button(
          "create",
          () => {
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
          },
          "save-button"
        );
        container.append(saveButton);
      }
      header.append(titleInput, backButton);
      colorPickerDiv.append(colorPicker, randomColorButton);
    },
  },
};

pages.home.create(currentMode);

notes.forEach((note) => {
  checkForCoords(note);
});

export { timeStampDiv, pages };
