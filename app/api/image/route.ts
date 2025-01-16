import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
const axios = require("axios").default;

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to pro.",
        { status: 403 }
      );
    }

    const options = {
      method: "POST",
      url: "https://api.edenai.run/v2/image/generation",
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZTE3NWU3OTctMTg5Mi00ODVhLWJjNTYtOWQxNTIzMTM1YzI3IiwidHlwZSI6ImFwaV90b2tlbiJ9.OGOVnJ-x1PZH7WZYwPTE7URg2S43L2TTrtD4wSKELqo",
      },
      data: {
        providers: "replicate/classic",
        text: prompt,
        resolution: resolution,
      },
    };

    const response = await axios.request(options);

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response.data["replicate/classic"]);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
