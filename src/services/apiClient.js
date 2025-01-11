import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const apiClient = axios.create({
  baseURL: process.env.API_URL,
  timeout: 5000, // 5 seconds
  headers: {
    Authorization: `Basic ${Buffer.from(
      `${process.env.Consumer_Key}:${process.env.Consumer_Secret}`
    ).toString("base64")}`,
  },
  family: 4,
});

export default apiClient;
