# SlippiStatsBot
A Discord bot dedicated to analysis of Project Slippi SLP replay files on Discord.

### TODO
- [ ] Implement SLP replay analysis (should activate upon the bot being mentioned)
	- [x] Get players' names (not connection codes), characters, stage, game length, date and time, and platform (console vs dolphin)
	- [x] Determine the number of kills each player had, final stock count at the end of the game
	- [ ] Figure out custom stock emojis to display final stock count
	- [ ] Design final layout of embed to be used
	- [ ] Flags/arguments to include/not include certain stages
	- [ ] Picture of stage to indicate stage played on
	- [ ] Include link to/txt file of JSON data to be used elsewhere
	- [ ] Handle exceptions to weird SLP files/replays for Akaneia/BM exclusive content
- [ ] Create an about command that describes information about the bot
- [x] Add license
- [ ] Potentially implement userinfo command (?)
- [ ] Finish this readme file with contact information, command information, table of contents, ~~libraries used~~
- [x] Implement usage of a `config.json` or `.env` file instead of having to locally declare it in the shell (using [ts-dotenv](https://www.npmjs.com/package/ts-dotenv))

### Libaries Utilized
This Discord bot was made with the following Node.js packages
- [discord-ts](https://discord-ts.js.org/) - A superset of [discord.js](https://discord.js.org/#/) with TypeScript decorators to improve readability
- [slippi-js](https://github.com/project-slippi/slippi-js) - A JavaScript/TypeScript library for parsing Project Slippi replay files for Super Smash Bros. Melee
- [table](https://www.npmjs.com/package/table) - Library that simply produces a row-column table with ASCII characters
- [Axios](https://axios-http.com/) - Promise based HTTP client for Node.js
- [ts-dotenv](https://www.npmjs.com/package/ts-dotenv) - Library that implements `.env` files to hold the Discord bot's token

### Development
- `git clone` this repository and navigate into it
- `npm install`
- Create the file `.env` in the root directory and include the line `BOT_TOKEN="<bot-token-id>"` where you replace `<bot-token-id>` with your own from the [Discord developer portal](https://discord.com/developers/).
- `npm run build`
- `npm run start`
you are done, you will see your bot up and running. For detailed installation guide, please [see this](https://oceanroleplay.github.io/discord.ts/docs/installation)

