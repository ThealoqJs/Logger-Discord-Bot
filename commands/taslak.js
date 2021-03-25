const { MessageEmbed } = require("discord.js");
const database = require("croxydb");
const config = require("../config.json")

exports.run = async (client, message, args) => {

if (message.author.id !== message.guild.owner.id)
return message.channel.send(new MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
.setDescription("Komutu sadece `SUNUCU SAHİBİ` kullanabilir!")
.setColor("RED")).then(a => a.delete({timeout: 5000}))

if(!args[0]) return message.channel.send(new MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
.setDescription(`Komutu yanlış kulllandın gösterdiğim gibi kullan. \n\nDoğru Kullanım: **${config.prefix}log-kanal ayarla #kanal | sıfırla**`)
.setColor("RED")).then(a => a.delete({timeout: 5000}))

if (args[0] === "ayarla") {
let log = message.mentions.channels.first()
if (!log) {
return message.channel.send(new MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
.setDescription(`Komutu yanlış kullandın gösterdiğim gibi kullan. \n\nDoğru Kullanım: **${config.prefix}log-kanal ayarla #kanal | sıfırla**`)
.setColor("RED")).then(a => a.delete({timeout: 5000}))
}

await database.set(`log.${message.guild.id}`, `${log.id}`)
message.channel.send(new MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
.setDescription(`Log kanalı başarılı bir şekilde ayarlandı.`)
.setColor("GREEN")).then(a => a.delete({timeout: 5000}))
}

if (args[0] === "sıfırla") {
await database.delete(`log.${message.guild.id}`)
message.channel.send(new MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
.setDescription("Log sistemi başarıyla sıfırlandı!")
.setColor("GREEN")).then(a => a.delete({timeout: 5000}))
}
}
exports.conf = {
  aliases: []
};

exports.help = {
  name: "log"
};