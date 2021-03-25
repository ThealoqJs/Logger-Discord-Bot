const config = require("../config.json");
module.exports = client => {
client.user.setPresence({ activity: { name: `${config.botPlaying}` }, status: 'idle' })
console.log(`${client.user.tag} bot başarıyla aktif edildi.`)
};