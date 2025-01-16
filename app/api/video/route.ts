import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
const axios = require("axios").default;
const FormData = require("form-data");

import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to pro.",
        { status: 403 }
      );
    }

    // Prepare the form data
    const form = new FormData();
    form.append("providers", "amazon");
    form.append("text", prompt);

    const options = {
      method: "POST",
      url: "https://api.edenai.run/v2/video/generation_async",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZTE3NWU3OTctMTg5Mi00ODVhLWJjNTYtOWQxNTIzMTM1YzI3IiwidHlwZSI6ImFwaV90b2tlbiJ9.OGOVnJ-x1PZH7WZYwPTE7URg2S43L2TTrtD4wSKELqo",
        ...form.getHeaders(),
      },
      data: form,
    };

    // Send the initial request to start the video generation
    const result = await axios.request(options);
    const publicId = result.data.public_id;

    if (!publicId) {
      return new NextResponse("Failed to retrieve public ID", { status: 500 });
    }

    // Polling function to check job status
    const pollForResult = async (publicId: any) => {
      const maxRetries = 20; // Maximum number of retries
      const delay = 330000; // Delay between retries in milliseconds
      let retries = 0;

      while (retries < maxRetries) {
        const response = await axios.get(
          `https://api.edenai.run/v2/video/generation_async/${publicId}`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZTE3NWU3OTctMTg5Mi00ODVhLWJjNTYtOWQxNTIzMTM1YzI3IiwidHlwZSI6ImFwaV90b2tlbiJ9.OGOVnJ-x1PZH7WZYwPTE7URg2S43L2TTrtD4wSKELqo",
            },
          }
        );

        const status = response.data.status;

        if (status === "finished") {
          return response.data; // Return the final data
        }

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        // Wait before the next retry
        retries++;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      throw new Error("Job did not complete within the expected time");
    };

    // Wait for the job to complete
    const finalResult = await pollForResult(publicId);

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(finalResult);
  } catch (error) {
    console.log("[VIDEO_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
