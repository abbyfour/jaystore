import { Command } from "../Command";

export function displayClickableCommand(command: Command) {
  return `</${command.name}:${command.discordID}>`;
}
