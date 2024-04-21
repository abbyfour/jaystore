import chalk from "chalk";
import { Database } from "./Database";
import { Bot } from "./discord/Bot";

async function main() {
  console.log(
    chalk.bold.cyan(
      "\n\n   d8,                                                             \n" +
        "  `8P                                 d8P                          \n" +
        "                                   d888888P                        \n" +
        "  d88   d888b8b  ?88   d8P  .d888b,  ?88'   d8888b   88bd88b d8888b\n" +
        "  ?88  d8P' ?88  d88   88   ?8b,     88P   d8P' ?88  88P'  `d8b_,dP\n" +
        "   88b 88b  ,88b ?8(  d88     `?8b   88b   88b  d88 d88     88b    \n" +
        "   `88b`?88P'`88b`?88P'?8b `?888P'   `?8b  `?8888P'd88'     `?888P'\n" +
        "    )88                 )88                                        \n" +
        "   ,88P                ,d8P                                        \n" +
        "`?888P              `?888P'                                        \n"
    )
  );

  const database = Database.getInstance();
  await database.connect();
  console.log(`-> Database:  ${chalk.cyan.bold("connected")}`);

  const bot = Bot.getInstance();
  await bot.login();
  console.log(`-> Discord:   ${chalk.cyan.bold("connected")}`);

  console.log(`-> JayStore:  ${chalk.cyan.bold("in flight")}`);
}

main();
