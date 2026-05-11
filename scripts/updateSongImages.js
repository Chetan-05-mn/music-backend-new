import fs from "fs";

import axios from "axios";

import { v4 as uuidv4 }
from "uuid";

import {
  PutObjectCommand
} from "@aws-sdk/client-s3";

import {
  ScanCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";

import { s3 }
from "../config/s3.js";

import { docClient }
from "../config/db.js";




// ================= LOAD JSON =================

const songsData = JSON.parse(

  fs.readFileSync(
    "./2026a2_songs.json",
    "utf-8"
  )
);




// ================= S3 BUCKET =================

const BUCKET_NAME =
  "music-app-images-107";




// ================= PROCESS SONGS =================

const processSongs = async () => {

  //  GET ALL SONGS FROM DYNAMODB

  const dbSongs = await docClient.send(

    new ScanCommand({
      TableName: "Songs"
    })
  );



  const songsInDB =
    dbSongs.Items || [];



  for (const song of songsData.songs) {

    try {

      console.log(
        `Processing: ${song.title}`
      );



      // ================= FIND SONG IN DB =================

      const matchedSong =
        songsInDB.find(

          dbSong =>

            dbSong.title === song.title
        );



      if (!matchedSong) {

        console.log(
          `Song not found in DB: ${song.title}`
        );

        continue;
      }



      // ================= DOWNLOAD IMAGE =================

      const response =
        await axios.get(
          song.img_url,
          {
            responseType: "arraybuffer"
          }
        );



      // ================= UNIQUE FILE NAME =================

      const fileName =
        `${uuidv4()}.jpg`;



      // ================= UPLOAD TO S3 =================

      await s3.send(

        new PutObjectCommand({

          Bucket: BUCKET_NAME,

          Key: fileName,

          Body: response.data,

          ContentType: "image/jpeg"
        })
      );



      // ================= GENERATE S3 URL =================

      const s3Url =

        `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;



      console.log(
        `Uploaded: ${s3Url}`
      );



      // ================= UPDATE DYNAMODB =================

      await docClient.send(

        new UpdateCommand({

          TableName: "Songs",

          Key: {

            songId:
              matchedSong.songId
          },

          UpdateExpression:
            "set img_url = :url",

          ExpressionAttributeValues: {

            ":url": s3Url
          }
        })
      );



      console.log(
        `Updated DynamoDB: ${song.title}`
      );



    } catch (err) {

      console.error(
        `Failed: ${song.title}`
      );

      console.error(err);
    }
  }

  console.log(
    " All songs processed successfully"
  );
};




// ================= RUN =================

processSongs();