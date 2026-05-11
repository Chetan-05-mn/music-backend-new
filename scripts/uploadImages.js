import fs from "fs";

import axios from "axios";

import path from "path";

import { v4 as uuidv4 } from "uuid";

import { PutObjectCommand }
from "@aws-sdk/client-s3";

import { s3 } from "../config/s3.js";



// 🔥 LOAD JSON

const songsData = JSON.parse(

  fs.readFileSync(
    "./2026a2_songs.json",
    "utf-8"
  )
);



const BUCKET_NAME =
  "music-app-images-107";



const uploadImages = async () => {

  for (const song of songsData.songs) {

    try {

      console.log(
        `Uploading ${song.title}`
      );



      // DOWNLOAD IMAGE

      const response =
        await axios.get(
          song.img_url,
          {
            responseType: "arraybuffer"
          }
        );



      const fileName =
        `${uuidv4()}.jpg`;



      // UPLOAD TO S3

      await s3.send(

        new PutObjectCommand({

          Bucket: BUCKET_NAME,

          Key: fileName,

          Body: response.data,

          ContentType: "image/jpeg"
        })
      );



      // GENERATE S3 URL

      const s3Url =
        `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;



      console.log(
        "Uploaded:",
        s3Url
      );



    } catch (err) {

      console.error(err);
    }
  }
};



uploadImages();