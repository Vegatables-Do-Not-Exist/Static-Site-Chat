const videoQueue = [];
let currentVideoIndex = 0;
let player;

document.getElementById('add-video').addEventListener('click', () => {
  const url = document.getElementById('video-url').value;
  const videoId = extractVideoId(url);
  if (videoId) {
    addVideoToQueue(videoId);
  }
});

document.getElementById('play-pause').addEventListener('click', () => {
  if (player.getPlayerState() === YT.PlayerState.PLAYING) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
});

document.getElementById('remove-video').addEventListener('click', () => {
  if (videoQueue.length > 0) {
    videoQueue.splice(currentVideoIndex, 1);
    if (currentVideoIndex >= videoQueue.length) {
      currentVideoIndex = videoQueue.length - 1;
    }
    loadNextVideo();
  }
});

function extractVideoId(url) {
  const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|https?:\/\/(?:www\.)?youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function addVideoToQueue(videoId) {
  videoQueue.push(videoId);
  updateVideoList();
  if (videoQueue.length === 1) {
    loadNextVideo();
  }
}

function updateVideoList() {
  const list = document.getElementById('video-list');
  list.innerHTML = '';
  videoQueue.forEach((videoId, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `Video ${index + 1}`;
    list.appendChild(listItem);
  });
}

function loadNextVideo() {
  if (videoQueue.length > 0) {
    const videoId = videoQueue[currentVideoIndex];
    const iframe = document.getElementById('video-player');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&controls=1`;
  }
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('video-player', {
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    currentVideoIndex++;
    if (currentVideoIndex < videoQueue.length) {
      loadNextVideo();
    }
  }
}
