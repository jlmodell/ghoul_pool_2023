import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../utils/connections/mongodb";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, username, email, password, key } = req.body;

  const secureKey = process.env.GHOULPOOL_INVITE_KEY as string;

  if (key !== secureKey) {
    return res.status(400).json({ message: "Invalid invite key" });
  }

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const client = await clientPromise;
  const db = client.db("next-auth");
  const users = db.collection("users");

  const filter = {
    $or: [
      { username: (username as string).toLowerCase() },
      { email: (email as string).toLowerCase() },
    ],
  };

  const user = await users.findOne(filter);

  if (user) {
    return res
      .status(400)
      .json({ message: "User already exists, try logging in." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await users
    .insertOne({
      name,
      username,
      email,
      password: hashedPassword,
      potentialGhoul: [],
      createdAt: new Date(),
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ message: err.message || "Something went wrong" });
    });

  res.status(201).json({ message: "User created" });
}

// generate 10 random characters
// const key =
//   Math.random().toString(36).substring(2, 15) +
//   Math.random().toString(36).substring(2, 15);
