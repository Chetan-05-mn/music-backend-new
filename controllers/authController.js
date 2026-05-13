import {
  PutCommand,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";

import { docClient } from "../config/db.js";


// REGISTER

export const registerUser = async (req, res) => {

  try {

    const { email, username, password } = req.body;

    const data = await docClient.send(
      new ScanCommand({
        TableName: "Users"
      })
    );

    const existingUser = data.Items.find(
      user => user.email === email
    );

    if (existingUser) {

      return res.status(400).json({
        message: "Email already exists"
      });
    }

    await docClient.send(
      new PutCommand({
        TableName: "Users",
        Item: {
          email,
          user_name: username,
          password,
          subscription: "free"
        }
      })
    );

    res.json({
      message: "Registered successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Register error"
    });
  }
};


// LOGIN

export const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const data = await docClient.send(
      new ScanCommand({
        TableName: "Users"
      })
    );

    const user = data.Items.find(
      u =>
        u.email === email &&
        u.password === password
    );

    if (!user) {

      return res.status(400).json({
        message: "Email or password invalid"
      });
    }

    res.json({
      message: "Login successful",
      user_name: user.user_name,
      email: user.email,
      subscription: user.subscription
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Login error"
    });
  }
};