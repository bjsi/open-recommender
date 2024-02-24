import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

exec(`DATABASE_URL="${process.env.PROD_DATABASE_URL}" npx prisma studio`);
