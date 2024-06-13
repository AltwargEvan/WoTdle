import { env } from "@/env/server";
import { Client, GatewayIntentBits } from "discord.js";

export async function sendDiscordCronErrorNotification(message: string) {
  const discord = new Client({
    intents: [GatewayIntentBits.DirectMessages],
  });
  await discord.login(env.DISCORD_BOT_TOKEN);
  const user = await discord.users.fetch(env.DISCORD_USER_ID);
  user.send(
    `Failed to update Wotdle Data for ${new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      timeZone: "America/New_York",
    })}`
  );
  user.send("```json\n" + message + "\n```");
}
