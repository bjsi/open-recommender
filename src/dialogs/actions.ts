import inquirer from "inquirer";
// @ts-ignore
import searchlist from "inquirer-search-list";

inquirer.registerPrompt("search-list", searchlist);

export const searchList = async (args: {
  message: string;
  choices: string[];
  default?: string;
}) => {
  const { message, choices, default: def } = args;
  const res = await inquirer.prompt([
    {
      type: "search-list",
      name: "choice",
      message: message,
      choices: choices,
      default: def,
    },
  ]);
  return res.choice as string;
};
