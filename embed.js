const Discord = require("discord.js");

let getEmbed = function (author) {

    let embed = new Discord.RichEmbed()

        .setColor([156, 36, 46])
        .setFooter("Jaill | © Developpé par Gun95", "https://cdn.discordapp.com/app-icons/702508895221973042/90816a2c917dd2445344da6a969d6e24.png")
        /*
         * Takes a Date object, defaults to current date.
         */
        .setTimestamp();
    return embed;
};

module.exports.getEmbed = getEmbed;