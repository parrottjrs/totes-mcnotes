import { MAX_LINES_KEY } from "./consts.js";
import { checkFontContrast } from "./functions.js";

export const CanvasNote = (canvas, c, note) => {
  const draw = () => {
    c.beginPath();
    c.fillStyle = note.color;
    c.fillRect(note.x, note.y, note.width, note.height);
    c.strokeStyle = checkFontContrast(note.color);
    c.strokeRect(note.x, note.y, note.width, note.height);
    c.font = "20px arial";
    c.fillStyle = checkFontContrast(note.color);
    c.fillText("+", note.x + 8, note.y + 17);
    c.font = "14px Comfortaa";
    c.textAlign = "center";

    let wrappedTitle = wrapCanvasText(
      c,
      note.title,
      note.x + note.width / 2,
      note.y + note.height / 4,
      note.width - 10,
      15
    );

    wrappedTitle.forEach(function (item) {
      c.fillText(item[0], item[1], item[2]);
    });
  };

  const update = () => {
    if (note.x < 0) {
      note.x = -note.x;
    }
    if (note.x + note.width > window.innerWidth) {
      note.x = window.innerWidth - note.width;
    }
    if (note.y < 0) {
      note.y = -note.y;
    }
    if (note.y + note.height > window.innerHeight) {
      note.y = window.innerHeight - note.height;
    }
    draw();
  };
  return {
    note,
    draw,
    update,
  };
};

export const TrashBin = (canvas, c, deletedNotes) => {
  const trashImage = new Image();
  trashImage.src = "./images/recycle.png";

  const draw = () => {
    if (deletedNotes.length === 0) {
      c.drawImage(
        trashImage,
        0,
        0,
        trashImage.width / 2,
        trashImage.height,
        canvas.clientWidth / 2 - trashImage.width / 4,
        canvas.clientHeight - 100,
        trashImage.width / 2,
        trashImage.height
      );
    } else {
      c.drawImage(
        trashImage,
        trashImage.width / 2,
        0,
        trashImage.width / 2,
        trashImage.height,
        canvas.clientWidth / 2 - trashImage.width / 4,
        canvas.clientHeight - 100,
        trashImage.width / 2,
        trashImage.height
      );
    }
  };
  return { draw };
};

export const canvasNoteFromCoords = (canvasNotes, x, y) => {
  return [...canvasNotes]
    .reverse()
    .find(
      ({ note }) =>
        x < note.x + note.width &&
        x > note.x &&
        y < note.y + note.height &&
        y > note.y
    );
};

export const wrapCanvasText = (c, text, x, y, maxWidth, lineHeight) => {
  let words = text.split(" ");
  let line = "";
  let testLine = "";
  let lineArray = [];

  for (let i = 0; i < words.length; i++) {
    testLine += `${words[i]} `;
    let metrics = c.measureText(testLine);
    let testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      lineArray.push([line, x, y]);
      y += lineHeight;
      line = `${words[i]} `;
      testLine = `${words[i]} `;
    } else {
      line += `${words[i]} `;
    }
    if (i === words.length - 1) {
      lineArray.push([line, x, y]);
    }
    if (lineArray.length === MAX_LINES_KEY) {
      lineArray.push(["...", x, y]);
      return lineArray;
    }
  }
  return lineArray;
};
