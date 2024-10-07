import axios, { AxiosError, AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest): Promise<NextResponse> {
  const reqData = await req.json();
  try {
    const resFromBE = await axios.post(process.env.NEXT_PUBLIC_BACKEND_HOSTNAME + "/auth/login", reqData);
    if (resFromBE.status === 200) {
      return NextResponse.json(resFromBE.data, {
        headers: {
          "Set-Cookie": `accessToken=${resFromBE.data.accessToken}; Path=/; HttpOnly; SameSite=Strict;`,
        },
      });
    }
    return new NextResponse(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
  } catch (err) {
    if (err instanceof AxiosError) {
      return axiosToNextResponse(err);
    }
    throw err;
  }
}

function axiosToNextResponse(axiosResponse: AxiosResponse | AxiosError): NextResponse {
  if (axiosResponse instanceof AxiosError) {
    // Handle AxiosError
    const errorResponse = axiosResponse.response;
    if (errorResponse) {
      return new NextResponse(JSON.stringify(errorResponse.data), {
        status: errorResponse.status,
        headers: Object.fromEntries(
          Object.entries(errorResponse.headers).map(([key, value]) => [key, value.toString()])
        ),
      });
    } else {
      // Network error or something went wrong with the request
      return new NextResponse(JSON.stringify({ message: axiosResponse.message }), {
        status: 500,
      });
    }
  } else {
    // Handle successful AxiosResponse
    return new NextResponse(JSON.stringify(axiosResponse.data), {
      status: axiosResponse.status,
      headers: Object.fromEntries(Object.entries(axiosResponse.headers).map(([key, value]) => [key, value.toString()])),
    });
  }
}
