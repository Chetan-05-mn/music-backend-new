import {
  ScanCommand,
  QueryCommand
} from "@aws-sdk/lib-dynamodb";

import { docClient }
from "../config/db.js";




// ================= GET SONGS =================

export const getAllSongs = async (
  req,
  res
) => {

  try {

    const {
      subscription,
      artist
    } = req.query;



    let songs = [];



    // ================= QUERY USING GSI =================

    if (artist) {

      const data =
        await docClient.send(

          new QueryCommand({

            TableName: "Songs",

            IndexName:
              "artist-index",

            KeyConditionExpression:
              "artist = :artist",

            ExpressionAttributeValues: {

              ":artist": artist
            }
          })
        );



      songs = data.Items || [];
    }



    // ================= NORMAL SCAN =================

    else {

      const data =
        await docClient.send(

          new ScanCommand({

            TableName: "Songs"
          })
        );



      songs = data.Items || [];
    }



    // ================= FREE USER LIMIT =================

    if (subscription !== "premium") {

      songs = songs.slice(0, 6);
    }



    res.json(songs);

  } catch (err) {

    console.error(err);

    res.status(500).json({

      message:
        "Error fetching songs"
    });
  }
};