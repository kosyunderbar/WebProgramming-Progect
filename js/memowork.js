const editor = document.getElementById("editor");
const BOLD = document.getElementById("Bold");
const ITALIC = document.getElementById("Italic");
const UDLINE = document.getElementById("Underline");
const STRIKE = document.getElementById("Strike");
const OL = document.getElementById("Olist");
const UL = document.getElementById("Ulist");
const MIDDLE = document.getElementById("Middle");
const LEFT = document.getElementById("Left");

//글씨 굵기 확장 기능
BOLD.addEventListener("click", function () {
  setStyle("bold");
});
//글씨 기울기 기능
ITALIC.addEventListener("click", function () {
  setStyle("italic");
});
//글씨 언더바 기능
UDLINE.addEventListener("click", function () {
  setStyle("underline");
});
//글씨 - 기능
STRIKE.addEventListener("click", function () {
  setStyle("strikeThrough");
});
//중앙 정렬 기능
MIDDLE.addEventListener("click", function () {
  setStyle("justifyCenter");
});
//왼쪽 정렬 기능
LEFT.addEventListener("click", function () {
  setStyle("justifyLeft");
});
//OL 기능
OL.addEventListener("click", function () {
  setStyle("insertOrderedList");
});
//UL 기능
UL.addEventListener("click", function () {
  setStyle("insertUnorderedList");
});

function setStyle(style) {
  document.execCommand(style);
  focusEditor();
}
//이미지 기능
const btnImage = document.getElementById("btn-image");
const imageSelector = document.getElementById("img-selector");

btnImage.addEventListener("click", function () {
  imageSelector.click();
});

imageSelector.addEventListener("change", function (e) {
  const files = e.target.files;
  if (!!files) {
    insertImageDate(files[0]);
  }
});

function insertImageDate(file) {
  const reader = new FileReader();
  reader.addEventListener("load", function (e) {
    focusEditor();
    document.execCommand("insertImage", false, `${reader.result}`);
  });
  reader.readAsDataURL(file);
}

//하이라이트 색상
const Highlight = document.getElementById("HIGHLIGHT");
Highlight.addEventListener("change", function () {
  setFontBackground(this.value);
});
function setFontBackground(color) {
  document.execCommand("hiliteColor", false, color);
  focusEditor();
}
function reportFont() {
  if (containerEl) {
    const high_light = getComputedStyleProperty(containerEl, "HIGHLIGHT");
    fontColorSelector.value = rgbToHex(fontColor).toUpperCase();
    if (high_light === "rgba(0, 0, 0, 0)") {
      fontBackgroundSelector.value = high_light;
    } else {
      fontBackgroundSelector.value = rgbToHex(high_light).toUpperCase();
    }
  }
}
function TOex(c) {
  const hex = parseInt(c).toString(16);
  console.log(hex);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(color) {
  const i = color.replace(/[^0-9,]/g, "");

  const rgb = i.split(",");
  return "#" + TOex(rgb[0]) + TOex(rgb[1]) + TOex(rgb[2]);
}
//폰트 싸이즈 변경 및 글꼴
const fontsizechange = document.getElementById("Font-size");
const fontSizeList = [7, 11, 16, 20, 26, 37, 72];
fontsizechange.addEventListener("change", function () {
  changeFontSize(this.value);
});

function changeFontSize(size) {
  document.execCommand("fontSize", false, size);
  focusEditor();
}
const fontnamechange = document.getElementById("Font-name");
fontnamechange.addEventListener("change", function () {
  changeFontName(this.value);
});

function changeFontName(name) {
  document.execCommand("fontName", false, name);
  focusEditor();
}
function checkStyle() {
  reportFont();
}

function getComputedStyleProperty(el, propName) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(el, null)[propName];
  } else if (el.currentStyle) {
    return el.currentStyle[propName];
  }
}

function reportFont() {
  let containerEl, sel;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      containerEl = sel.getRangeAt(0).commonAncestorContainer;
      if (containerEl.nodeType === 3) {
        containerEl = containerEl.parentNode;
      }
    }
  } else if ((sel = document.selection) && sel.type !== "Control") {
    containerEl = sel.createRange().parentElement();
  }

  if (containerEl) {
    const size = parseInt(fontSize.replace("px", ""));
    const fontName = getComputedStyleProperty(containerEl, "fontFamily");
    const fontSize = getComputedStyleProperty(containerEl, "fontSize");
    fontsizechange.value = fontSizeList.indexOf(size) + 1;
    fontnamechange.value = fontName.replaceAll('"', "");
  }
}
