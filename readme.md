# SlippiStatsBot
A Discord bot dedicated to analysis of Project Slippi SLP replay files on Discord.

### TODO
- [ ] Implement SLP replay analysis (should activate upon the bot being mentioned)
	- [ ] Get players' names (not connection codes), characters, stage, game length, date and time, and platform (console vs dolphin)
	- [ ] Determine the number of kills each player had, final stock count at the end of the game
	- [ ] Figure out custom stock emojis to display final stock count
	- [ ] Design final layout of embed to be used
	- [ ] Flags/arguments to include/not include certain stages
	- [ ] Picture of stage to indicate stage played on
	- [ ] Include link to/txt file of JSON data to be used elsewhere
	- [ ] Handle exceptions to weird SLP files/replays for Akaneia/BM exclusive content
- [ ] Create an about command that describes information about the bot
- [x] Add license
- [ ] Potentially implement userinfo command (?)
- [ ] Finish this readme file with contact information, command information, table of contents, libraries used

### Development
- `git clone` this repository and navigate into it
- `npm install`
- `npm run build`
- `set BOT_TOKEN=<your bot token>` on Windows or `export BOT_TOKEN=<your bot token>` on UNIX, if you don't have token yet than create one at [discord developer portal](https://discord.com/developers/)
- `npm run start`
you are done, you will see your bot up and running. For detailed installation guide, please [see this](https://oceanroleplay.github.io/discord.ts/docs/installation)

