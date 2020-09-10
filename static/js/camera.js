feather.replace();

const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
let streamStarted = false;

const constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
  }
};


var stream = () => {
  if (streamStarted) {
    video.play();
    return;
  }
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    const updatedConstraints = {
      ...constraints,
    };
    startStream(updatedConstraints);
  }
};


const startStream = async (constraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
};

stream();