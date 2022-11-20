const textInput = document.getElementById("text");
const saveBtn = document.getElementById("save-btn");
const fileInput = document.getElementById("file");
const modeBtn = document.getElementById("mode-btn");
const resetBtn = document.getElementById("reset-btn");
const eraserBtn = document.getElementById("eraser-btn");
const colorOptions = Array.from(
  // forEach를 사용하기 위해 HTML 컬렉션 말고 array 객체 사용
  document.getElementsByClassName("color-option")
);
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const GARO = 960;
const SERO = 540;

canvas.width = GARO;
canvas.height = SERO;

ctx.lineCap = "round";
ctx.lineWidth = lineWidth.ariaValueMax;

let isPainting = false; // 그림을 그릴 때는 True가 되게 함
let isFilling = false; // 기본값은 draw, 그리기 모드기 때문에.

function onMove(event) {
  if (isPainting) {
    // isPainting이 true면 페인팅함.
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
  // isPainting이 false면 마우스 위치만 움직임
}

function startPainting() {
  isPainting = true; // 클릭시에는 True
}

function cancelPainting() {
  isPainting = false; // 마우스를 떼면 다시 false로
  ctx.beginPath();
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color; // div에서 data-color에 저장한 color값 가져옴.
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

function onModeClick() {
  if (isFilling) {
    isFilling = false; // 채우기 모드면? -> 버튼엔 draw라고 나타남. 그래야 버튼 누르고 draw로 가니까.
    modeBtn.innerText = "Fill"; // isFilling이 true면 버튼은 'fill'이라고 나타남
  } else {
    isFilling = true; // 채우기 모드가 아니면? -> 버튼엔 fill이라고 나타남. 그래야 버튼 누르고 fill로 가니까.
    modeBtn.innerText = "Draw"; // isFilling이 false면 버튼은 'Draw'라고 나타남
  }
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, GARO, SERO);
  }
}

function onResetClick() {
  ctx.fillStyle = "white"; // 전체를 하얀색으로 fill 하는 것과 같음.
  ctx.fillRect(0, 0, GARO, SERO);
}

function onEraserClick() {
  ctx.strokeStyle = "white"; // 지우기 모드는 결국 흰색 브러쉬로 그리는 것과 같음.
  isFilling = false;
  modeBtn.innerText = "Fill";
}

function onFileChange(event) {
  const file = event.target.files[0]; // 선택한 파일의 url을 요청하는 과정.
  const url = URL.createObjectURL(file); // url로 파일에 접근하면 파일을 다룰 수 있음.
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, GARO, SERO); // ctx의 메소드 중 하나. 이미지를 필요로 하는데 이미 이미지를 위에서 뽑아냄.
    //drawImage(image, 시작하는 x좌표, 시작하는 y좌표, 가로 길이, 세로 길이)
  };
}

function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = "25px 'Press Start 2P'";
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
}

function onSaveClick() {
  // 원래는 이미지를 base64로 인코딩된 URL로 반환함.
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "필기 자료.png";
  a.click();
}

canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);

canvas.addEventListener("click", onCanvasClick);
lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach(color => color.addEventListener("click", onColorClick));
//forEach는 배열만 사용, 컬러가 클릭될 때 마다 color에 onColorClick을 통해 색 넣기

modeBtn.addEventListener("click", onModeClick);
resetBtn.addEventListener("click", onResetClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
