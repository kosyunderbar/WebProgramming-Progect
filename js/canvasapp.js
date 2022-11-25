const fontSize = document.getElementById("font-size");
const fontWeight = document.getElementById("font-weight");
const fontType = document.getElementById("font-type");
const pencil = document.getElementById("mode-pencil");
const circle = document.getElementById("mode-circle");
const rectangle = document.getElementById("mode-rectangle");
const triangle = document.getElementById("mode-triangle");

const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
);
const textInput = document.getElementById("text");
const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
const saveBtn = document.getElementById("save");
const fileInput = document.getElementById("file");
const lineWidth = document.getElementById("line-width");
const color = document.getElementById("color");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;

const info = document.querySelector(".tooltiptext");

canvas.width = 960;
canvas.height = 540;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";
let isPainting = false;
let isFilling = false;
let modePencil = true;
let modeRectangle = false;
let startRecting = false;
let modeCircle = false;
let startCircle = false;
let modeTriangle = false;
let startTriangle = false;

let prevMouseX = 0;
let prevMouseY = 0;
let startPX = 0;
let startPY = 0;
let startOX = 0;
let startOY = 0;
// 사각형 그리기
function beginRecting(event) {
  if (modeRectangle === true) {
    startRecting = true;
    startPX = event.pageX;
    startPY = event.pageY;
    startOX = event.offsetX;
    startOY = event.offsetY;
    ctx.beginPath();
  }
}

function stopRecting(event) {
  if (modeRectangle === true) {
    startRecting = false;
    ctx.stroke();
    ctx.closePath();
  }
}

function onMouseMoveR(event) {
  if (modeRectangle === true) {
    const x = event.pageX;
    const y = event.pageY;
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    if (!startRecting) {
    } else {
      const width = x - startPX;
      const height = y - startPY;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      ctx.rect(startOX, startOY, width, height);
    }
  }
}
function handleRectangle() {
  if (modeRectangle === false) {
    modePencil = false;
    modeCircle = false;
    modeRectangle = true;
    modeTriangle = false;
    isFilling = false;
  }
}

// 동그라미

function beginCircle(event) {
  if (modeCircle === true) {
    startCircle = true;
    ctx.beginPath();
  }
}

function stopCircle(event) {
  if (modeCircle === true) {
    startCircle = false;
    ctx.stroke();
    ctx.closePath();
  }
}

function onMouseMoveC(event) {
  if (modeCircle === true) {
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    if (!startCircle) {
    } else {
      let radius = Math.sqrt(
        Math.pow(prevMouseX - offsetX, 2) + Math.pow(prevMouseY - offsetY, 2)
      );
      ctx.beginPath();
      ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    }
  }
}
function handleCircle() {
  if (modeCircle === false) {
    modePencil = false;
    modeCircle = true;
    modeRectangle = false;
    modeTriangle = false;
    isFilling = false;
  }
}

// 세모

function beginTriangle(event) {
  if (modeTriangle === true) {
    startTriangle = true;
    ctx.beginPath();
  }
}

function stopTriangle(event) {
  if (modeTriangle === true) {
    startTriangle = false;
    ctx.closePath();
    ctx.stroke();
  }
}

function onMouseMoveT(event) {
  if (modeTriangle === true) {
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    if (!startTriangle) {
    } else {
      ctx.beginPath();
      ctx.moveTo(prevMouseX, prevMouseY);
      ctx.lineTo(offsetX, offsetY);
      ctx.lineTo(prevMouseX * 2 - event.offsetX, event.offsetY);
    }
  }
}

function handleTriangle() {
  modePencil = false;
  modeCircle = false;
  modeRectangle = false;
  isFilling = false;
  modeTriangle = true;
}

function onMove(event) {
  if (isPainting) {
    if (modePencil) {
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
    }
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}

function handlePencil() {
  modePencil = true;
  modeCircle = false;
  modeRectangle = false;
  modeTriangle = false;
  isFilling = false;
}

function onMouseDown(event) {
  isPainting = true;
  prevMouseX = event.offsetX;
  prevMouseY = event.offsetY;
}

function onMouseUp() {
  isPainting = false;
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
  ctx.beginPath();
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
  ctx.beginPath();
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
  ctx.beginPath();
}

function onModeClick(event) {
  isFilling = true;
  modePencil = false;
  modeCircle = false;
  modeRectangle = false;
  modeTriangle = false;
}

function onCavasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onDestoryClick() {
  if (window.confirm("정말로 초기화를 하십니까?")) {
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    modePencil = false;
    modeCircle = false;
    modeRectangle = false;
    modeTriangle = false;
    isFilling = false;
  }
}

function onEraserClick() {
  modePencil = true;
  ctx.beginPath();
  ctx.strokeStyle = "white";
  isFilling = false;
  modeCircle = false;
  modeRectangle = false;
}

function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
}

function onDoubleClick(event) {
  const text = textInput.value;
  const textSize = fontSize.value;
  const textWeight = fontWeight.value;

  if (text !== "") {
    ctx.save();
    modePencil = false;
    ctx.lineWidth = 1;
    ctx.font = `${textWeight} ${textSize}px ${"webfont3"}`;
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
  console.log(textWeight);
}

function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "필기자료.png";
  a.click();
}

canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", onMouseDown);
document.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("click", onCavasClick);
lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach(color => color.addEventListener("click", onColorClick));
// 사각형
canvas.addEventListener("mousemove", onMouseMoveR);
canvas.addEventListener("mousedown", beginRecting);
canvas.addEventListener("mouseup", stopRecting);
canvas.addEventListener("mouseleave", stopRecting);

// 동그라미
canvas.addEventListener("mousemove", onMouseMoveC);
canvas.addEventListener("mousedown", beginCircle);
canvas.addEventListener("mouseup", stopCircle);
canvas.addEventListener("mouseleave", stopCircle);

// 세모
canvas.addEventListener("mousemove", onMouseMoveT);
canvas.addEventListener("mousedown", beginTriangle);
canvas.addEventListener("mouseup", stopTriangle);
canvas.addEventListener("mouseleave", stopTriangle);

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestoryClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);

pencil.addEventListener("click", handlePencil);
circle.addEventListener("click", handleCircle);
rectangle.addEventListener("click", handleRectangle);
triangle.addEventListener("click", handleTriangle);

const lineRange = document.querySelector(".line-range");
lineRange.addEventListener("input", function () {
  const value = this.value;
  this.style.background = `linear-gradient(to right, #ff4500 0%, #ff4500 ${value}%, #fff ${value}%, white 100%)`;
});

const fontRange = document.querySelector(".font-range");
fontRange.addEventListener("input", function () {
  const value = this.value;
  this.style.background = `linear-gradient(to right, #ff4500 0%, #ff4500 ${value}%, #fff ${value}%, white 100%)`;
});
