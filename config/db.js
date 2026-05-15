import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

dotenv.config();

const client = new DynamoDBClient({
  region: "us-east-1"
});

export const docClient = DynamoDBDocumentClient.from(client);