window.addEventListener("DOMContentLoaded", init);

let LoadCount;
let time;
let clearTime;
let currentPos = 0;
function init() {
  refresh();

  const stopTime = document.querySelector(".stopBut");
  stopTime.addEventListener("click", swap);

  const newImgBut = document.querySelector(".newImagesButton");
  newImgBut.onclick = refresh;
  document.querySelectorAll("img").forEach((image) => {
    image.onload = loaded;
    document.querySelector(".stopBut").textContent = "STOP";
  });
  document.querySelector(".container").addEventListener("click", preview);
}
function preview(event) {
  if (event.target.tagName === "IMG") {
    event.target.classList.add("chose");
    document.querySelector(".bigImage").src = event.target.src;
    document.querySelector(".bigAuthor").textContent =
      event.target.dataset.author;
    clearTimeout(clearTime);
    document.querySelector(".stopBut").textContent = "PLAY";
  }
}
// document.querySelectorAll("img").classList.remove("chose");

// setTimeout(nextFoto, 2000);
function nextFoto() {
  let imgPack = [
    document.querySelector(".img1"),
    document.querySelector(".img2"),
    document.querySelector(".img3"),
    document.querySelector(".img4")
  ];
  imgPack[currentPos].classList.remove("chose");
  document.querySelector(".bigAuthor").textContent =
    imgPack[++currentPos].dataset.author;
  document.querySelector(".bigImage").src = imgPack[currentPos].dataset.order;
  imgPack[currentPos].classList.add("chose");

  if (currentPos >= imgPack.length - 1) {
    refresh();
  }
}

function swap(event) {
  if (event.target.textContent === "STOP") {
    event.target.textContent = "PLAY";
    time = 100;

    document.querySelector(".line").style.width = time + "%";
    clearTimeout(clearTime);
  } else if (event.target.textContent === "PLAY") {
    event.target.textContent = "STOP";
    timer();
  }
}

function timer() {
  clearTime = setTimeout(timer, 100);
  time -= 2;

  document.querySelector(".line").style.width = time + "%";
  if (time <= 0) {
    nextFoto();
    time = 100;
  }
}
function loaded(event) {
  LoadCount -= 1;
  if (LoadCount === 0) {
    timer();
  }
  event.target.classList.remove("loading");
}
function refresh() {
  LoadCount = 4;
  currentPos = 0;
  clearTimeout(clearTime);
  time = 100;

  document.querySelector(".line").style.width = time + "%";
  const page = Math.floor(Math.random() * 200);
  fetch("https://picsum.photos/v2/list?page=" + page + "&limit=4")
    .then((response) => response.json())
    .then((date) => {
      document.querySelectorAll("img").forEach((image, i) => {
        image.src = date[i].download_url;

        image.dataset.author = date[i].author;
        image.dataset.order = date[i].download_url;

        image.classList.add("loading");

        document.querySelector(".img1").classList.add("chose");
        document.querySelector(".bigImage").src = document.querySelector(
          ".img1"
        ).src;

        // setInterval(volgendefoto, 6000);
      });
    });
}
