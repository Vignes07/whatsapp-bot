import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const apiClient = axios.create({
  baseURL: process.env.API_URL, // Base URL from .env
  headers: {
    Authorization: `Basic ${Buffer.from(
      `${process.env.Consumer_Key}:${process.env.Consumer_Secret}`
    ).toString("base64")}`,
  },
});

export default apiClient;
