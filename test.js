import ReactPlayer from 'react-player';

const urls = [
  "www.instagram.com/giclsports/reel/DZK5PvJMLG9/",
  "https://vimeo.com/1199498932?fl=wc",
  "https://youtu.be/a51FlY_qd4g?si=9tXE9agysFxXXi3J"
];

urls.forEach(url => {
  console.log(url, 'canPlay:', ReactPlayer.canPlay(url));
});
