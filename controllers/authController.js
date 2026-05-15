import {
  PutCommand,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";

import { docClient }
from "../config/db.js";




// ================= REGISTER =================

export const registerUser = async (
  req,
  res
) => {

  try {

    const {
      email,
      user_name,
      password
    } = req.body;




    // ================= VALIDATION =================

    if (
      !email ||
      !user_name ||
      !password
    ) {

      return res.status(400).json({
        message:
          "All fields are required"
      });
    }




    // ================= CHECK EXISTING USER =================

    const data =
      await docClient.send(

        new ScanCommand({
          TableName: "Users"
        })
      );



    const existingUser =
      data.Items.find(
        user =>
          user.email === email
      );



    if (existingUser) {

      return res.status(400).json({
        message:
          "Email already exists"
      });
    }




    // ================= SAVE USER =================

    await docClient.send(

      new PutCommand({

        TableName: "Users",

        Item: {

          email,

          user_name,

          password,

          subscription:
            "free"
        }
      })
    );




    // ================= SUCCESS RESPONSE =================

    res.status(201).json({

      message:
        "Registered successfully",

      user_name,

      email,

      subscription:
        "free"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:
        "Register error"
    });
  }
};




// ================= LOGIN =================

export const loginUser = async (
  req,
  res
) => {

  try {

    const {
      email,
      password
    } = req.body;




    // ================= VALIDATION =================

    if (
      !email ||
      !password
    ) {

      return res.status(400).json({
        message:
          "All fields are required"
      });
    }




    // ================= GET USERS =================

    const data =
      await docClient.send(

        new ScanCommand({
          TableName: "Users"
        })
      );



    // ================= FIND USER =================

    const user =
      data.Items.find(
        u =>
          u.email === email &&
          u.password === password
      );




    // ================= INVALID USER =================

    if (!user) {

      return res.status(400).json({
        message:
          "Email or password invalid"
      });
    }




    // ================= SUCCESS RESPONSE =================

    res.json({

      message:
        "Login successful",

      user_name:
        user.user_name,

      email:
        user.email,

      subscription:
        user.subscription
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:
        "Login error"
    });
  }
};