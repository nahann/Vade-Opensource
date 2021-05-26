import { RunFunction } from '../../interfaces/Event';

   export const run: RunFunction = async (client, button) => {
       if(button.replied) console.log(button)
    console.log(button)

   switch(button.id) {
       case "test": {
      if(!button.replied) button.channel.send("test")
       }
   }
    }
export const name: string = 'clickButton';