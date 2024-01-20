import readline from "readline";

export const confirm = async (msg: string) => {
  const confirm = await new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(msg + "? (y/n): ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
  if (confirm !== "y") {
    console.log("Aborting");
    return false;
  } else {
    return true;
  }
};
