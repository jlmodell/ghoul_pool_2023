import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../utils/connections/mongodb";

interface Session {
  user: {
    email: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await unstable_getServerSession(
    req,
    res,
    authOptions
  )) as unknown as Session;

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const client = await clientPromise;
  const db = client.db("next-auth");
  const collection = db.collection("users");

  if (req.method === "GET") {
    const user = await collection.findOne({
      email: session?.user?.email,
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const potentialGhoul = user.potentialGhoul;

    res.status(200).json(potentialGhoul);
  } else if (req.method === "POST") {
    const { name, age } = req.body;

    const points = calculatePoints(+age);

    const names = name.split(" ");
    const capitalizedName = names.map((name) => {
      return name.charAt(0).toUpperCase() + name.slice(1);
    });

    const result = await collection.updateOne(
      { email: session?.user?.email },
      {
        $push: {
          potentialGhoul: {
            name: capitalizedName.join(" "),
            age: +age,
            points,
            isAlive: true,
          },
        },
      },
      {
        returnOriginal: false,
      }
    );

    if (result.modifiedCount === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(201).json({ message: "Created" });
  } else if (req.method === "DELETE") {
    const { name } = req.query;

    const result = await collection.updateOne(
      { email: session?.user?.email },
      { $pull: { potentialGhoul: { name } } },
      {
        returnOriginal: false,
      }
    );

    if (result.modifiedCount === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "Deleted" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

function calculatePoints(age) {
  return 100 - age > 0 ? 100 - age : 0;
}
