import { bot } from '../lib/handler.js';
import { exec } from 'child_process';
import simplegit from 'simple-git';

const git = simplegit();
bot(
	{
		pattern: 'update',
		isPublic: false,
		desc: 'Update the bot',
		type: 'system',
	},
	async (message, match) => {
		await git.fetch();
		const commits = await git.log(['master..origin/master']);
		if (commits.total === 0) return await message.sendReply('```No changes in the latest commit```');
		if (match === 'now') {
			await message.sendReply('*Updating...*');
			exec('git stash && git pull origin master', async (err, stderr) => {
				if (err) return await message.sendReply('```' + stderr + '```');
				await message.sendReply('*Restarting...*');
				exec(require('../package.json').scripts.start, (err, _, stderr) => {
					if (err) return message.sendReply('```' + stderr + '```');
					message.sendReply('*Restart complete*');
				});
			});
		} else {
			let changes = '_New update available!_\n\n' + '*Patches:* ```' + commits.total + '```\n' + '*Changes:*\n' + commits.all.map((c, i) => '```' + (i + 1) + '. ' + c.message + '```').join('\n') + '\n*To update, send* ```' + message.prefix + 'update now```';
			await message.sendReply(changes);
		}
	},
);
