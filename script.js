
var radius = 240;
var autoRotate = true;
var rotateSpeed = -60;
var imgWidth = 120;
var imgHeight = 170;

setTimeout(init, 100);

var odrag = document.getElementById("ground-container");
var oimgs = document.getElementById("imgs-container");
var aImg = oimgs.getElementsByTagName("img");

oimgs.style.width = imgWidth + "px";
oimgs.style.height = imgHeight + "px";

var ground = document.getElementById("ground");
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
  for (var i = 0; i < aImg.length; i++) {
    aImg[i].style.transform =
      "rotateY(" +
      i * (360 / aImg.length) +
      "deg) translateZ(" +
      radius +
      "px)";
    aImg[i].style.transition = "transform 1s";
    aImg[i].style.transitionDelay =
      delayTime || (aImg.length - i) / 4 + "s";
  }
}

function applyTransform(obj) {
  if (tY > 180) tY = 180;
  if (tY < 0) tY = 0;
  obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
}

function playSpin(yes) {
  oimgs.style.animationPlayState = yes ? "running" : "paused";
}

var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10;

if (autoRotate) {
  var animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
  oimgs.style.animation = `${animationName} ${Math.abs(
    rotateSpeed
  )}s infinite linear`;
}

// Touch and Mouse Drag Handling
document.onpointerdown = function(e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX, sY = e.clientY;

  this.onpointermove = function(e) {
    e = e || window.event;
    var nX = e.clientX, nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTransform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function(e) {
    odrag.timer = setInterval(function() {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTransform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

// Mouse Wheel Handling
document.onwheel = function(e) {
  e = e || window.event;
  var d = e.deltaY || -e.detail;
  radius += d;
  init(1);
};

// Handle Touch Events
document.addEventListener('touchstart', function(e) {
  clearInterval(odrag.timer);
  var touch = e.touches[0];
  var sX = touch.clientX, sY = touch.clientY;

  function touchMove(e) {
    var touch = e.touches[0];
    var nX = touch.clientX, nY = touch.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTransform(odrag);
    sX = nX;
    sY = nY;
  }

  function touchEnd() {
    odrag.timer = setInterval(function() {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTransform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    document.removeEventListener('touchmove', touchMove);
    document.removeEventListener('touchend', touchEnd);
  }

  document.addEventListener('touchmove', touchMove);
  document.addEventListener('touchend', touchEnd);
}, { passive: false });
