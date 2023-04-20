import { CanvasNote, TrashBin, canvasNoteFromCoords } from "../canvas.js";
import { header, timeStampDiv } from "../consts.js";
import {
  changePage,
  clear,
  components,
  createIntroNote,
  createSortMethod,
  currentMode,
  deleteNote,
  deletedNotes,
  exportNote,
  importTotesMcNotes,
  mapNotes,
  notes,
  saveNote,
  setCurrentMode,
  setMultipleAttributes,
  sortNotes,
} from "../functions.js";
import { pages } from "./index.js";

export let previousMode = undefined;

export const home = {
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
      previousMode = currentMode;
      setCurrentMode("trash");
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
          event.clientY - header.clientHeight - timeStampDiv.clientHeight - 12;

        const canvasNote = canvasNoteFromCoords(canvasNotes, start.x, start.y);
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
          moved: (currentNote.note.moved = new Date().toLocaleString("en-US")),
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
          previousMode = currentMode;
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
          event.clientY - header.clientHeight - timeStampDiv.clientHeight - 12;

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
          window.innerHeight - header.clientHeight - timeStampDiv.clientHeight;

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
        setCurrentMode(previousMode);
        changePage("home", previousMode);
      });

      const noteButtonDiv = document.createElement("div");
      noteButtonDiv.classList.add("note-button-div");

      header.append(headerText, backButton);
      container.append(noteButtonDiv);

      mapNotes(deletedNotes);
    }
  },
};
