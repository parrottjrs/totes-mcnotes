export const NOTE_COLOR = "#fffa5c";
export const NOTE_X = 10;
export const NOTE_Y = 10;
export const NOTE_SIZE = 125;
export const NOTE_WIDTH = NOTE_SIZE;
export const NOTE_HEIGHT = NOTE_SIZE;
export const MAX_LINES_KEY = 5;

export const body = document.querySelector("body");
export const header = document.createElement("header");
header.setAttribute("id", "header");
export const container = document.createElement("section");
container.setAttribute("id", "container");

export const timeStampDiv = document.createElement("div");
timeStampDiv.setAttribute("id", "time-stamp-div");

body.append(header, container);
container.insertAdjacentElement("beforebegin", timeStampDiv);
