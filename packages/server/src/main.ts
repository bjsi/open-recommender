import express from "express";
import passport from "passport";
import TwitterStrategy from "passport-twitter";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import session from "express-session";
import { authRoutes } from "./routes/auth";
import { publicApiRoutes } from "./routes/publicApi";
import { authenticatedApiRoutes } from "./routes/authenticatedApi";

dotenv.config();
const prisma = new PrismaClient();

passport.use(
  new TwitterStrategy.Strategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY!,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET!,
      callbackURL: "http://localhost:3000/auth/twitter/callback",
    },
    async function (_, __, profile, done) {
      try {
        let user = await prisma.user.findUnique({
          where: { twitterId: profile.id },
        });

        if (user) {
          console.log("user already exists", user);
        }

        if (!user) {
          console.log(
            "user does not exist, creating new user with profile",
            profile
          );
          user = await prisma.user.create({
            data: {
              twitterId: profile.id,
              name: profile.displayName,
              username: profile.username,
              profile_image_url: profile._json.profile_image_url,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, (user as any).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const app = express();
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_KEY!, // Change to a random, secure string for production
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session()); // if using sessions
// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: "http://localhost:5173", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);

const authCheck = (req: any, res: any, next: any) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated",
    });
  } else {
    next();
  }
};

// set up routes
app.use("/auth", authRoutes);
app.use("/api", publicApiRoutes);
app.use("/api", authCheck, authenticatedApiRoutes);

// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page
app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
