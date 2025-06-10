// const { fork } = require('child_process');
// const mainfile = 'index.js';
// const attemptsToTry = 3;
// let attempts = 0;
// let bot;
// async function spawn() {
//     bot = fork(mainfile);
//     bot.on('exit', async () => {
//         attempts++;
//         if (attempts >= attemptsToTry) { console.log(`${attemptsToTry} crashes reached, exiting process.`); process.exit() }
//         console.log('Process exited, restarting in 5 seconds...');
//         bot = undefined;
//         setTimeout(() => { spawn(); }, 5000);
//         setTimeout(() => { attempts = 0; }, 3 * 1000 * 60);
//     })
// }
// spawn();