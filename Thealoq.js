const Discord  = require("discord.js");
const client = new Discord.Client();
const database = require("croxydb");
const config = require("./config.json")
const fs = require("fs"); 
const { error } = require("console");
const moment = require('moment');
require("./Util/eventLoader")(client);
const logs = require('discord-logs');
logs(client);

const log = message => {
console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
if (err) console.error(err);
log(`[${files.length}] Tane Komut Yükleniyor...`);
files.forEach(f => {
let props = require(`./commands/${f}`);
client.commands.set(props.help.name, props);
props.conf.aliases.forEach(alias => {
client.aliases.set(alias, props.help.name);
});
});
});
  
client.reload = command => {
return new Promise((resolve, reject) => {
try {
delete require.cache[require.resolve(`./commands/${command}`)];
let cmd = require(`./commands/${command}`);
client.commands.delete(command);
client.aliases.forEach((cmd, alias) => {
if (cmd === command) client.aliases.delete(alias);
});
client.commands.set(command, cmd);
cmd.conf.aliases.forEach(alias => {
client.aliases.set(alias, cmd.help.name);
});
resolve();
} catch (e) {
reject(e);
}
});
};
  
client.load = command => {
return new Promise((resolve, reject) => {
try {
let cmd = require(`./commands/${command}`);
client.commands.set(command, cmd);
cmd.conf.aliases.forEach(alias => {
client.aliases.set(alias, cmd.help.name);
});
resolve();
} catch (e) {
reject(e);
}
});
};
  
client.unload = command => {
return new Promise((resolve, reject) => {
try {
delete require.cache[require.resolve(`./commands/${command}`)];
client.commands.delete(command);
client.aliases.forEach((cmd, alias) => {
if (cmd === command) client.aliases.delete(alias);
});
resolve();
} catch (e) {
reject(e);
}
});
};
  
client.elevation = message => {
if (!message.guild) {
return;
}
let permlvl = 0;
if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
if (message.author.id === config.botOwner) permlvl = 4;
return permlvl;
};

client.on("channelCreate", async channel => {
  let log = await database.get(`log.${channel.guild.id}`)
  if(log){
    const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE', limit: 1 }).then(audit => audit.entries.first());
    const embed = new Discord.MessageEmbed().setColor("008000").setDescription(`• Bir kanal Oluştu Oluşturan kişi ${entry.executor} 
    \n • Eklinen Kanal : ${channel.name} 
    \n • Ekliyen Kişinin İd ${entry.executor.id} 
    `).setThumbnail(entry.executor.displayAvatarURL())
    client.channels.cache.get(log).send(embed)
    
  }
    })
  

  
client.on("channelDelete", async channel => {
  let log = await database.get(`log.${channel.guild.id}`)
  if(log){
    const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE', limit: 1 }).then(audit => audit.entries.first());
  const embed = new Discord.MessageEmbed().setColor("FF0000").setDescription(`• Bir kanal Sildiği Silen kişi ${entry.executor} 
  \n • Silinen Kanal : ${channel.name} 
  \n • Silen Kişinin İd ${entry.executor.id} 
  `).setThumbnail(entry.executor.displayAvatarURL())
  client.channels.cache.get(log).send(embed)
  }
  })



  
client.on("ready", () => {
  client.channels.cache.get("822924666841595944").join();
})

//  if(role.author.bot) return;


client.on("roleDelete", async role => {
  
  let log = await database.get(`log.${role.guild.id}`)
  if(log){
    const entry = await role.guild.fetchAuditLogs({ type: "ROLE_DELETE" }).then(audit => audit.entries.first());
  const rolembed = new Discord.MessageEmbed().setColor("FF0000").setDescription(`• Rol Silen Kişi ${entry.executor} 
  \n • Silinen Rol : ${role.name} 
  \n • Silen Kişinin İd ${entry.executor.id}`).setThumbnail(entry.executor.displayAvatarURL())
  client.channels.cache.get(log).send(rolembed)
  }
})


client.on("roleCreate", async role => {

  let log = await database.get(`log.${role.guild.id}`)
  if(log){
    const entry = await role.guild.fetchAuditLogs({ type: "ROLE_CREATE" }).then(audit => audit.entries.first());
    const rolembed = new Discord.MessageEmbed().setColor("008000").setDescription(`• Rol Oluşturan Kişi ${entry.executor} 
    \n • Oluşturan Rol : ${role.name} 
    \n • Oluşturan Kişinin İd ${entry.executor.id}`).setThumbnail(entry.executor.displayAvatarURL())
    client.channels.cache.get(log).send(rolembed)
  }
})

client.on("messageDelete", async message => {
  if(message.author.bot) return;
  let log = await database.get(`log.${message.guild.id}`)
  if(log){
    const entry = await message.guild.fetchAuditLogs({ type: "MESSAGE_DELETE", limit:1 }).then(audit => audit.entries.first());
    const msgembed = new Discord.MessageEmbed().setColor("008000").setDescription(`• Mesaji Silen Kişi ${entry.executor} 
    \n • Silinen Mesaj : ${message.content} 
    \n • Silenen Kişinin İd ${entry.executor.id}`).setThumbnail(entry.executor.displayAvatarURL())
    client.channels.cache.get(log).send(msgembed)
  }
}
)


client.on("messageUpdate", async (oldMessage, newMessage) => { 
  if(oldMessage.author.bot) return;
  let log = await database.get(`log.${oldMessage.guild.id}`)
  if(log){
    const entry = await oldMessage.guild.fetchAuditLogs({ type: "MESSAGE_UPDATE", limit:1 }).then(audit => audit.entries.first());
    const msgembed = new Discord.MessageEmbed().setColor("008000").setDescription(`• Mesaji Silen Kişi ${entry.executor} 
    \n • Eski Mesaj : ${oldMessage.content} 
    \n • Yeni Mesaj  ${newMessage.content}
    \n • Silenen Kişinin İd ${entry.executor.id}`).setThumbnail(entry.executor.displayAvatarURL())
    client.channels.cache.get(log).send(msgembed)
  }
}
)

moment.locale('tr')

client.on("guildMemberAdd", async member =>{
  const channel = await database.get(`memberlog.${member.guild.id}`);
  if (!channel) return;
  client.channels.cache.get(channel).send(new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setDescription(`
     • Hoş Geldin Kullanci ${member} \n
     • Seninle Birlikte ${member.guild.memberCount} Olduk  \n
     • ${member.guild.name} Sunucusuna Hoş Geldin \n
     • Hesabi ne Zamana Oluşturdu : ${moment.utc(member.user.createdAt).format('L')}
      `)
    .setThumbnail(member.user.displayAvatarURL())).catch(console.error);
})


moment.locale('tr')

client.on("guildMemberRemove", async member => {
  const channel = await database.get(`memberlog.${member.guild.id}`);
  if (!channel) return;
  client.channels.cache.get(channel).send(new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setDescription(`
     • Görüşürüz Kullanci ${member} \n
     • Seninle Birlikte ${member.guild.memberCount} Olduk Yine Bekleriz \n
     • ${member.guild.name} Sunucusuna Tekran Görüşmek Üzere \n
     • Hesabi ne Zamana Oluşturdu : ${moment.utc(member.user.createdAt).format('L')}
      `)
    .setThumbnail(member.user.displayAvatarURL())).catch(console.error);
})

client.on("guildMemberOnline", (member, newStatus) => {
  if (member.user.id !== "710523748247142500") return;
let embed = new Discord.MessageEmbed().setAuthor("Thealoq <3 Stârk").setColor("GOLD").setImage("https://cdn.discordapp.com/attachments/823654527613141042/823697122963882014/background.gif")

client.guilds.cache.get("821460733132537878").channels.cache.get("821460733564420109").send(embed.setDescription(`${member.user} ${newStatus} oldu bir Merhaba Deyin Bakalim!`))

});


 client.on("userAvatarUpdate",  async (user, oldAvatarURL, newAvatarURL) => {
 let embed = new Discord.MessageEmbed().setAuthor("Thealoq <3 Stârk").setColor("GOLD")

  client.guilds.cache.get("821460733132537878").channels.cache.get("822895810890039326").send(embed.setDescription(`
    • Avatari Değiştiren Kullanci ${user.tag} `).setImage(oldAvatarURL))
    
   
}); 


client.on("userAvatarUpdate",  async (user, oldAvatarURL, newAvatarURL) => {
  let embed = new Discord.MessageEmbed().setAuthor("Thealoq <3 Stârk").setColor("GOLD")
 
   client.guilds.cache.get("821460733132537878").channels.cache.get("822895810890039326").send(embed.setDescription(`
     • Avatari Değiştiren Kullanci ${user.tag} `).setImage(newAvatarURL))
     
    
 });
 







client.on("voiceChannelJoin", async (member, channel) => {
  const channelx = await database.get(`memberlog.${member.guild.id}`);
  if (!channelx) return;
  client.channels.cache.get(channelx).send(new Discord.MessageEmbed()
  .setColor("#008000")
  .setDescription(`
  • Kanala Giriş Yapan Kullanci ${member} \n
  • Giriline Kanal ${channel.name}
  `))
});


client.on("voiceChannelLeave", async (member, channel) => {
  const channelx = await database.get(`memberlog.${member.guild.id}`);
  if (!channelx) return;
  client.channels.cache.get(channelx).send(new Discord.MessageEmbed()
  .setColor("#ff0000")
  .setDescription(`
  • Kanaldan Çıkış Yapan Kullanci ${member} \n
  • Çıkılan Kanal ${channel.name}
  `))
});

  client.on("guildMemberBoost", async (member) => {
    const channelx = await database.get(`memberlog.${member.guild.id}`);
    if (!channelx) return;
    client.channels.cache.get(channelx).send(new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setDescription(`
    • Boost Yapan Kullanci ${member.user.tag} Saol Dostum
    `))
});

client.on("guildMemberUnboost", async (member) => {
  const channelx = await database.get(`memberlog.${member.guild.id}`);
  if (!channelx) return;
  client.channels.cache.get(channelx).send(new Discord.MessageEmbed()
  .setColor("#ff0000")
  .setDescription(`
  • Boost Basmayi Birakan Kullanci ${member.user.tag} Bizi Üzdün Dostum
  `))
});




client.on("guildChannelPermissionsUpdate",  async (channel, oldPermissions, newPermissions) => {
  const channelx = await database.get(`log.${channel.guild.id}`);
  if (!channelx) return;
  client.channels.cache.get(channelx).send(new Discord.MessageEmbed()
  .setColor("#ff0000")
  .setDescription(`
  • Ayarlari Değişen Kanal ${channel.name} 
  `))
});



client.on("roleDelete", async role => {
  const entry = await role.guild.fetchAuditLogs({ type: "ROLE_DELETE" }).then(audit => audit.entries.first());
if (entry.executor.id == client.user.id) return;
role.guild.roles.create({ data: {
   name: role.name,
   color: role.color,
   hoist: role.hoist,
   permissions: role.permissions,
   mentionable: role.mentionable,
   position: role.position
}, reason: 'Silinen Rol Açıldı.'})
})

client.on("UserUpdate", async user => {
 

})




client.login(config.token);
