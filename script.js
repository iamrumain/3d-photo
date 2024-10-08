var radius = 240;
var autoRotate = true;
var rotateSpeed = -60;
var imgWidth = 120;
var imgHeight = 170;
var zoomFactor = 1; // Added zoom factor

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
      radius * zoomFactor +
      "px)"; // Apply zoom factor
    aImg[i].style.transition = "transform 1s";
    aImg[i].style.transitionDelay =
      delayTime || (aImg.length - i) / 4 + "s";
  }
}

function applyTransform(obj) {
  if (tY > 180) tY = 180;
  if (tY < 0) tY = 0;
  obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg) scale(" + zoomFactor + ")";
}

function playSpin(yes) {
  oimgs.style.animationPlayState = yes ? "running" : "paused";
}

var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10;
var initialDistance = 0;
var isZooming = false;

if (autoRotate) {
  var animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
  oimgs.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

function handlePointerDown(e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX, sY = e.clientY;

  function handlePointerMove(e) {
    e = e || window.event;
    var nX = e.clientX, nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTransform(odrag);
    sX = nX;
    sY = nY;
  }

  function handlePointerUp() {
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
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  }

  document.addEventListener('pointermove', handlePointerMove);
  document.addEventListener('pointerup', handlePointerUp);
}

function handleTouchStart(e) {
  if (e.touches.length === 2) { // Pinch-to-zoom
    isZooming = true;
    var dx = e.touches[0].clientX - e.touches[1].clientX;
    var dy = e.touches[0].clientY - e.touches[1].clientY;
    initialDistance = Math.sqrt(dx * dx + dy * dy);
  } else {
    clearInterval(odrag.timer);
    var touch = e.touches[0];
    var sX = touch.clientX, sY = touch.clientY;

    function handleTouchMove(e) {
      if (isZooming) {
        if (e.touches.length === 2) {
          var dx = e.touches[0].clientX - e.touches[1].clientX;
          var dy = e.touches[0].clientY - e.touches[1].clientY;
          var newDistance = Math.sqrt(dx * dx + dy * dy);
          zoomFactor *= newDistance / initialDistance;
          initialDistance = newDistance;
          init(); // Update the images with the new zoom factor
        }
      } else {
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
    }

    function handleTouchEnd() {
      isZooming = false;
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
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    }

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }
}

document.addEventListener('pointerdown', handlePointerDown);
document.addEventListener('touchstart', handleTouchStart, { passive: false });

document.onwheel = function(e) {
  e = e || window.event;
  var d = e.deltaY || -e.detail;
  radius += d;
  init(1);
};
