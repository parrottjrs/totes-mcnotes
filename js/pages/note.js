import {
  NOTE_COLOR,
  NOTE_HEIGHT,
  NOTE_WIDTH,
  NOTE_X,
  NOTE_Y,
  container,
  timeStampDiv,
} from "../consts.js";
import {
  changePage,
  checkFontContrast,
  components,
  currentMode,
  deleteConfirmation,
  deleteNote,
  randomColor,
  saveNote,
  setMultipleAttributes,
} from "../functions.js";

export const note = {
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
};
