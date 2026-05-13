import {
  PutCommand,
  ScanCommand,
  DeleteCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";

import { docClient } from "../config/db.js";


// ================= ADD SUBSCRIPTION =================

export const addSubscription = async (
  req,
  res
) => {

  try {

    const {
      email,
      song
    } = req.body;

    // 🔥 check existing subscription
    const data = await docClient.send(
      new ScanCommand({
        TableName: "Subscriptions"
      })
    );

    const exists = data.Items.find(
      item =>
        item.email === email &&
        item.songId === song.songId
    );

    if (exists) {

      return res.status(400).json({
        message: "Already subscribed"
      });
    }

    //  add subscription
    await docClient.send(
      new PutCommand({
        TableName: "Subscriptions",

        Item: {
          email,
          songId: song.songId,

          title: song.title,
          artist: song.artist,
          album: song.album,
          year: song.year,

          img_url: song.img_url
        }
      })
    );

    res.json({
      message: "Subscribed successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Subscription error"
    });
  }
};


// ================= GET SUBSCRIPTIONS =================

export const getSubscriptions = async (
  req,
  res
) => {

  try {

    const { email } = req.query;

    const data = await docClient.send(
      new ScanCommand({
        TableName: "Subscriptions"
      })
    );

    const subscriptions =
      data.Items.filter(
        item => item.email === email
      );

    res.json(subscriptions);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Fetch error"
    });
  }
};


// ================= REMOVE SUBSCRIPTION =================

export const removeSubscription = async (
  req,
  res
) => {

  try {

    const {
      email,
      songId
    } = req.body;

    await docClient.send(
      new DeleteCommand({
        TableName: "Subscriptions",

        Key: {
          email,
          songId
        }
      })
    );

    res.json({
      message: "Removed successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Delete error"
    });
  }
};
// ================= UPGRADE SUBSCRIPTION =================

export const upgradeSubscription = async (
  req,
  res
) => {

  try {

    const { email } = req.body;

    //Update user table
    await docClient.send(

      new UpdateCommand({

        TableName: "Users",

        Key: {
          email: email
        },

        UpdateExpression:
          "SET subscription = :sub",

        ExpressionAttributeValues: {
          ":sub": "premium"
        }
      })
    );

    res.json({
      message: "Premium upgraded successfully",
      subscription: "premium"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Upgrade failed"
    });
  }
};