import { Request, Response } from "express";
import {
  signupValidator,
  loginValidator,
  LoginValidator,
  SignupValidator,
  UpdateProfileValidator,
  updateProfileValidator,
} from "../utils/validator";
import { User } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config";

export async function signup(req: Request, res: Response) {
  try {
    const inputBody: SignupValidator = req.body;
    const parsedInputBody = signupValidator.safeParse(inputBody);
    if (!parsedInputBody.success) {
      res.status(400).json({
        error: "Bad Request",
        message: `Invalid input type: ${parsedInputBody.error.errors[0].path[0]} (${parsedInputBody.error.errors[0].message})`,
      });
      return;
    }

    let user = await User.findOne({ email: inputBody.email });
    if (user) {
      res.status(400).json({
        error: "Bad Request",
        message: `email already registered`,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(inputBody.password, 20);

    user = new User({
      ...inputBody,
      password: hashedPassword,
    });
    const savedUser = await user.save();

    if (!savedUser) {
      res.status(500).json({
        error: "internal server error",
        message: `something went wrong while signing up`,
      });
      return;
    }

    res.status(201).json({
      message: `profile created successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "internal server error", message: `${error}` });
    console.log(error);
  }
}

export async function signin(req: Request, res: Response) {
  try {
    const inputBody: LoginValidator = req.body;
    const parsedInputBody = loginValidator.safeParse(inputBody);
    if (!parsedInputBody.success) {
      res.status(400).json({
        error: "Bad Request",
        message: `Invalid input type: ${parsedInputBody.error.errors[0].path[0]} (${parsedInputBody.error.errors[0].message})`,
      });
      return;
    }

    let user = await User.findOne({ email: inputBody.email });
    if (!user) {
      res.status(400).json({
        error: "Bad Request",
        message: `email not registered`,
      });
      return;
    }

    const comparedPassword = await bcrypt.compare(
      inputBody.password,
      user.password,
    );

    if (!comparedPassword) {
      res.status(403).json({
        error: "access forbidden",
        message: `wrong password`,
      });
      return;
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET);
    res.status(201).json({
      message: `signed in successfully`,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "internal server error", message: `${error}` });
    console.log(error);
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    let user = await User.findOne({ _id: id });
    if (!user) {
      res.status(400).json({
        error: "Bad Request",
        message: `email not registered`,
      });
      return;
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "internal server error", message: `${error}` });
    console.log(error);
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const inputBody: UpdateProfileValidator = req.body;
    const parsedInputBody = updateProfileValidator.safeParse(inputBody);
    if (!parsedInputBody.success) {
      res.status(400).json({
        error: "Bad Request",
        message: `Invalid input type: ${parsedInputBody.error.errors[0].path[0]} (${parsedInputBody.error.errors[0].message})`,
      });
      return;
    }

    let user = await User.findOne({ _id: id });
    if (!user) {
      res.status(400).json({
        error: "Bad Request",
        message: `email not registered`,
      });
      return;
    }

    await User.updateOne({ _id: id }, { $set: inputBody });

    res.status(201).json({
      message: `profile updated successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "internal server error", message: `${error}` });
    console.log(error);
  }
}
