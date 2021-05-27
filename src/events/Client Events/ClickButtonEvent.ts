import { RunFunction } from "../../interfaces/Event";

export const run: RunFunction = async (client, button) => {
  if(button.deferred) return;
  if (button.replied) return;

  switch (button.id) {
    case "test": {
      const user = (await client.users.fetch(button.data.member.user.id));
     button.reply.send(`${user.tag} clicked the button!`);
     await button.reply()
    }
  }
};
export const name: string = "clickButton";
