const header = document.querySelector("#header");
const container = document.querySelector("#container");
const timeWrapper = document.createElement("div");
timeWrapper.setAttribute("id", "time-wrapper");
container.insertAdjacentElement("beforebegin", timeWrapper);

let currentMode = localStorage.currentMode;

const pages = {
  home: {
    create(mode) {
      if (localStorage.length === 0) {
        mode = "grid";
      }

      const headerText = document.createElement("h1");
      headerText.innerText = "Notes";

      const moveButton = components.moveButton("+ new note", () =>
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
        moveButton,
        importButton,
        exportButton,
        modeButton
      );

      if (mode === "grid") {
        const sortMenu = document.createElement("select");
        sortMenu.setAttribute("id", "sort-menu");
        sortMenu.value = "<--select an option-->";
        sortMenu.addEventListener("change", () => {
          sortNotes();
        });
        const labelForSortMenu = document.createElement("label");
        setAttributes(labelForSortMenu, {
          for: "#sort-menu",
          class: "label-for-sort-menu",
        });
        labelForSortMenu.innerText = "Sort Notes By:";
        timeWrapper.append(labelForSortMenu, sortMenu);

        createSortMethod("<--select an option-->");
        createSortMethod("Date Updated: new to old");
        createSortMethod("Date Updated: old to new");
        createSortMethod("Date Created: new to old");
        createSortMethod("Date Created: old to new");

        const noteButtonWrapper = document.createElement("div");
        noteButtonWrapper.classList.add("wrapper");

        container.append(noteButtonWrapper);

        sortNotes();
      } else {
        notes = notes.sort((a, b) =>
          new Date(a.moved) < new Date(b.moved) ? -1 : 1
        );

        const canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height =
          window.innerHeight - header.clientHeight - timeWrapper.clientHeight;
        const c = canvas.getContext("2d");
        container.append(canvas);

        const canvasNotes = notes.map((note) => CanvasNote(canvas, c, note));

        let currentNote = undefined;

        let start = { x: undefined, y: undefined };
        let mouse = { x: undefined, y: undefined };
        let direction = { x: undefined, y: undefined };

        canvas.addEventListener("mousedown", (event) => {
          event.preventDefault();

          start.x = event.clientX;
          start.y =
            event.clientY - header.clientHeight - timeWrapper.clientHeight;

          const canvasNote = canvasNoteFromCoords(
            canvasNotes,
            start.x,
            start.y
          );
          currentNote = canvasNote;
          canvasNotes.push(
            canvasNotes.splice(canvasNotes.indexOf(currentNote), 1)[0]
          );
        });

        canvas.addEventListener("mouseup", (event) => {
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
        });

        canvas.addEventListener("mousemove", (event) => {
          if (!currentNote) {
            return;
          }
          event.preventDefault();

          mouse.x = event.clientX;
          mouse.y =
            event.clientY - header.clientHeight - timeWrapper.clientHeight;

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
          requestAnimationFrame(animate);

          c.clearRect(0, 0, innerWidth, innerHeight);

          for (let i = 0; i < canvasNotes.length; i++) {
            canvasNotes[i].update();
          }
        };
        const cancelAnimationFrame = () => {
          window.cancelAnimationFrame;
        };
        if (canvasNotes === []) {
          cancelAnimationFrame;
        }
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
      setAttributes(titleInput, {
        type: "text",
        placeholder: "My New Note...",
      });
      titleInput.classList.add("title-input");

      const saveButton = document.createElement("button");
      saveButton.classList.add("edit-button");

      const noteContent = document.createElement("div");
      noteContent.setAttribute("id", "note-content");
      noteContent.style.backgroundColor = "#fffa5c";
      noteContent.style.color = "#000000";

      container.append(noteContent);

      const quill = new Quill(noteContent, { theme: "snow" });

      const editor = document.querySelector(".ql-toolbar.ql-snow");
      editor.style.backgroundColor = "#fffa5c";
      editor.style.border = "0";

      const colorPicker = document.createElement("input");
      setAttributes(colorPicker, {
        id: "color-picker",
        type: "color",
        value: "#fffa5c",
      });
      colorPicker.addEventListener("change", () => {
        const colorPicker = document.getElementById("color-picker");
        const noteContent = document.getElementById("note-content");
        noteContent.style.backgroundColor = colorPicker.value;
        noteContent.style.color = hex2rgb(colorPicker.value);
        editor.style.backgroundColor = colorPicker.value;
      });

      if (note) {
        const timeStamp = document.createElement("p");
        timeStamp.innerText = `Created On: ${note.created} ---- Last Edit: ${note.updated}`;
        timeStamp.classList.add("time-stamp");
        timeWrapper.append(timeStamp);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerText = "delete";
        deleteButton.addEventListener("click", () => {
          trashNote(note);
          deleteNote(note);
        });
        container.append(saveButton, deleteButton);

        titleInput.value = note.title;
        colorPicker.value = note.color;
        quill.setContents(note.content);
        editor.style.backgroundColor = note.color;
        noteContent.style.backgroundColor = note.color;
        noteContent.style.color = hex2rgb(note.color);

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
            x: 0,
            y: 0,
            width: 125,
            height: 125,
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

      const noteButtonWrapper = document.createElement("div");
      noteButtonWrapper.classList.add("wrapper");

      header.append(headerText, moveButton);
      container.append(noteButtonWrapper);

      deletedNotes.map((note) => {
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
    },
  },
};
