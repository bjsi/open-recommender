import express from "express";
import passport from "passport";
import TwitterStrategy from "passport-twitter";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import session from "express-session";
import { authRoutes } from "./routes/auth";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import * as trpcExpress from "@trpc/server/adapters/express";
import { authenticatedRouter } from "./routers/authenticatedRouter";
import { createContext, mergeRouters } from "./trpc";
import { adminRouter } from "./routers/adminRouter";
import { publicRouter } from "./routers/publicRouter";

dotenv.config();
const prisma = new PrismaClient();

passport.use(
  new TwitterStrategy.Strategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY!,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET!,
      includeEmail: true,
      callbackURL: `${process.env.SERVER_URL}/auth/twitter/callback`,
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
            JSON.stringify(profile, null, 2)
          );
          user = await prisma.user.create({
            data: {
              twitterId: profile.id,
              email: profile.emails![0].value,
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
  console.log("serializeUser", user);
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
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session()); // if using sessions
// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: process.env.CLIENT_URL!, // allow to server to accept request from different origin
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
app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: mergeRouters(publicRouter, authenticatedRouter),
    createContext,
  })
);

// function apiKeyValidationMiddleware(req, res, next) {
//   const apiKey = req.headers["x-api-key"];
//   if (!apiKey) {
//     return res.status(401).send("API key is required");
//   }

//   prisma.user
//     .findUnique({ where: { apiKey } })
//     .then((user) => {
//       if (!user) {
//         return res.status(401).send("Invalid API key");
//       }
//       req.user = user; // Attach user to the request object
//       next();
//     })
//     .catch((error) => {
//       return res.status(500).send("Internal Server Error");
//     });
// }

// app.use("/api-key", apiKeyValidationMiddleware, (req, res) => {
//   res.send("Accessed protected route");
// });

const appRouter = mergeRouters(publicRouter, adminRouter, authenticatedRouter);

export type AppRouter = typeof appRouter;

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
