import fs from "fs";

const data = JSON.parse(
  fs.readFileSync("./2026a2_songs.json", "utf-8")
);

// optional: add premium flag
const songs = data.songs.map(song => ({
  ...song,
  isPremium: Math.random() < 0.3
}));

export default songs;