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
.setDescription(`Komutu yanlış kulllandın gösterdiğim gibi kullan. \n\nDoğru Kullanım: **${config.prefix}memberlog-kanal ayarla #kanal | sıfırla**`)
.setColor("RED")).then(a => a.delete({timeout: 5000}))

if (args[0] === "ayarla") {
let memberlog = message.mentions.channels.first()
if (!memberlog) {
return message.channel.send(new MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
.setDescription(`Komutu yanlış kullandın gösterdiğim gibi kullan. \n\nDoğru Kullanım: **${config.prefix}memberlog-kanal ayarla #kanal | sıfırla**`)
.setColor("RED")).then(a => a.delete({timeout: 5000}))
}

await database.set(`memberlog.${message.guild.id}`, `${memberlog.id}`)
message.channel.send(new MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
.setDescription(`Log kanalı başarılı bir şekilde ayarlandı.`)
.setColor("GREEN")).then(a => a.delete({timeout: 5000}))
}

if (args[0] === "sıfırla") {
await database.delete(`memberlog.${message.guild.id}`)
message.channel.send(new MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
.setDescription("memberLog sistemi başarıyla sıfırlandı!")
.setColor("GREEN")).then(a => a.delete({timeout: 5000}))
}
}
exports.conf = {
  aliases: []
};

exports.help = {
  name: "memberlog"
};