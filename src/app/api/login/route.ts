import axios, { AxiosError, AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { constants } from "@/constants";
export async function POST(req: NextRequest): Promise<NextResponse> {
  const reqData = await req.json();
  try {
    const resFromBE = await axios.post(process.env.NEXT_PUBLIC_BACKEND_HOSTNAME + "/auth/login", reqData);
    if (resFromBE.status === 200) {
      return NextResponse.json(resFromBE.data, {
        headers: {
          "Set-Cookie": `accessToken=${resFromBE.data.accessToken}; Path=/; HttpOnly; SameSite=Strict; Expires=${constants.ACCESS_TOKEN_EXPIRES}`,
        },
      });
    }
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  } catch (err) {
    if (err instanceof AxiosError) return axiosToNextResponse(err);
    throw err;
  }
}

function axiosToNextResponse(axiosResponse: AxiosResponse | AxiosError): NextResponse {
  if (axiosResponse instanceof AxiosError) {
    const errorResponse = axiosResponse.response;
    if (errorResponse) {
      return NextResponse.json(errorResponse.data, {
        status: errorResponse.status,
      });
    } else {
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  } else {
    return NextResponse.json(axiosResponse.data, { status: axiosResponse.status });
  }
}
