import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"


export async function POST(req: NextRequest) {
  try {
    console.log("entered")

    await dbConnect();

    const reqBody = await req.json();
    console.log(reqBody);
    const { email, password } = reqBody;
    const user = await User.findOne({ email });
    console.log(user);

    //check if user exists
    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }

    //check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    console.log(validPassword);

    //create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email
    }
    console.log(tokenData)

    //create token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" })
    console.log(token)
    const response = NextResponse.json({
      message: 'Login successfull',
      success: true,
    })

    response.cookies.set("token", token, {
      httpOnly: true
    })

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}