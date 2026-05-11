import fs from "fs";
import { docClient } from "./config/db.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const data = JSON.parse(fs.readFileSync("2026a2_songs.json"));

const upload = async () => {
  for (let i = 0; i < data.songs.length; i++) {
    const song = data.songs[i];

    const item = {
      songId: (i + 1).toString(),
      title: song.title,
      artist: song.artist,
      album: song.album,
      year: song.year,
      img_url: song.img_url,
      isPremium: i >= 6 // first 6 free, rest premium
    };

    await docClient.send(
      new PutCommand({
        TableName: "Songs",
        Item: item
      })
    );

    console.log(`Uploaded: ${item.title}`);
  }

  console.log("ALL SONGS UPLOADED");
};

upload();