'use strict';

const embed = require("./embed.js");
const app = require("./app.js");

let role = ["LevN LVL 1", "LevN LVL 2", "LevN LVL 3",
    "LevP LVL 1", "LevP LVL 2", "LevP LVL 3",
    "ArgosN LVL 1", "ArgosN LVL 2", "ArgosN LVL 3",
    "ArgosP LVL 1", "ArgosP LVL 2", "ArgosP LVL 3",
    "FlecheN LVL 1", "FlecheN LVL 2", "FlecheN LVL 3",
    "FlecheP LVL 1", "FlecheP LVL 2", "FlecheP LVL 3",
];

let roleClass = ["Jeune Délinquant", "Délinquant", "Récidiviste", "Grand Bandit"];
let rolePrison = ["En Detention"];
let channelIdPrison = null;
let timeInPrison = 30000

module.exports = {
    'test': test,
    'createRole': createRole,
    'help': help,
    'setPresence': setPresence,
    'prison': prison,
    'createVoicechannel': createVoiceChannel
};

function test(message) {
    console.log(message);
    message.channel.send("hey");
}

let response = "";


function createVoiceChannel(message) {
    message.guild.createChannel("Prison", "voice")
        .then(
            (chan) => {
                channelIdPrison = chan;
                chan.overwritePermissions(message.guild.roles.find('name', '@everyone'), { // Disallow Everyone to see, join, invite, or speak
                    'CREATE_INSTANT_INVITE': false, 'VIEW_CHANNEL': true,
                    'CONNECT': false, 'SPEAK': true
                }).then(role => message.reply("Created new Prison"))
                    .catch(console.error)
            })
}

function createRole(message) {
    createRoleOnServer(message, roleClass, 233, 30, 99);
    createRoleOnServer(message, rolePrison, 255, 255, 255);
}

let createRoleOnServer = function (message, role, r, g, b) {
    for (let i = 0; i < role.length; i++) {
        message.guild.createRole({
            name: role[i],
            color: [r, g, b],
            mentionable: true
        })
            .then(role => message.reply("Created new role with name " + role.name))
            .catch(console.error)
    }
};

let myAddField = function (embed, title, response) {
    if (response.length < 1024) {
        embed.addField(title, response);
        return embed;
    } else {
        let array = response.match(/[\s\S]{1,1023}/g) || [];
        embed.addField(title, array[0]);
        for (let i = 1; i < array.length; i++) {
            embed.addField("_ _", array[i]);
        }
        return embed;
    }
};

let responseRole = embed.getEmbed();

let setRole = function (message, raid, bungieName) {

    let y = 0;
    responseRole = embed.getEmbed();
    responseRole.addField("Player Found", bungieName);

    for (let i = 0; i < nameRaid.length; i++) {
        findRole(message, raid[i], nameRaid[i], role[y], role[y + 1], role[y + 2]);
        y += 3;
    }
    message.channel.send(responseRole)
        .catch(console.error);
};


function help(message) {
    let tmp = message.content.split("$");
    tmp = tmp[1].split(" ");
    let embedResponse = embed.getEmbed();
    if (tmp.length === 2 && tmp[1] === "fr") {
        if (message.member.displayName != null)
            embedResponse.setAuthor(message.member.displayName);
        embedResponse.setDescription("Je suis la JUSTICE.\n" +
            "Toi ! Qui fais des blagues pas drôles craint mon courroux.\n");
        embedResponse.addField("Mes Commandes :",
            "$help : Pour voir ça\n" +
            "$prison <utilisateur> : met l'utilisateur en prison\n" +
            "$createvoicechannel : Cree la prison\n" +
            "$createrole : Cree les different role");
        message.channel.send(embedResponse)
            .catch(console.error);
    } else {
        if (message.member.displayName != null)
            embedResponse.setAuthor(message.member.displayName);
        embedResponse.setDescription("I am JUSTICE\n" +
            "You ! Who make not funny jokes fear my wrath.\n");
        embedResponse.addField("My Command :",
            "$help : to see that\n" +
            "$prison <utilisateur> : Choose your favorite class\n" +
            "$createvoicechannel : Create the jail\n" +
            "$createrole : Create diferent role");
        message.channel.send(embedResponse)
            .catch(console.error);
    }
}

function setPresence(message) {
    let tmp = message.content.split("$");
    tmp = tmp[1].split("presence");
    if (tmp.length === 2) {
        app.setPresence(tmp[1]);
        response = "Presence set to : " + tmp[1];
        sendMsg(message);
    }
}


function prison(message) {
    let tmp = message.content.split("$");
    tmp = tmp[1].split("prison ");
    if (tmp.length === 2) {
        let roleToRemove = "";
        let myRoles = []
        let isfind = false

        message.guild.members.find(function (value, key, map) {
            //console.log(key)
            //console.log(value)
            if (tmp[1].toLowerCase() === "gun95") {
                response = "Petit pd, Gun95 baise ta mere";
                sendMsg(message)
            } else if (value.user.username.toLowerCase() === tmp[1].toLowerCase() && value.voiceChannelID != null) {
                isfind = true
                console.log("find ", value.user.username)
                let oldvoiceChannelID = value.voiceChannelID;
                value.setVoiceChannel(channelIdPrison).catch(console.error)
                setTimeout(function () {
                    value.setVoiceChannel(oldvoiceChannelID).catch(console.error)
                }, timeInPrison)


                for (let i = 0; i < value.roles.array().length; i++) {
                    myRoles.push(value.roles.array()[i].name)
                    console.log(value.roles.array()[i].name)
                }
                let intersection = myRoles.filter(x => roleClass.includes(x));
                console.log(intersection);
                if (intersection[0] !== roleClass[roleClass.length - 1]) {
                    for (let i = 0; i < intersection.length; i++) {
                        roleToRemove = message.member.guild.roles.find('name', intersection[i]);
                        value.removeRole(roleToRemove)
                            .catch(console.error);
                    }
                    if (intersection.length !== 0 && roleClass.indexOf(intersection[0]) + 1 < roleClass.length) {
                        value.addRole(message.member.guild.roles.find('name', roleClass[roleClass.indexOf(intersection[0]) + 1]))
                            .catch(console.error);
                        response = tmp[1] + " à encore été mis en prison"
                        sendMsg(message)
                    } else {
                        value.addRole(message.member.guild.roles.find('name', roleClass[0]))
                            .catch(console.error);
                        //message.reply(tmp).catch(console.error);
                        response = tmp[1] + " à été mis en prison"
                        sendMsg(message)
                    }
                } else {
                    response = tmp[1] + " est un pd en prison"
                    sendMsg(message)
                }


            }
        });

        if (!isfind) {
            response = "Personne non trouver"
            sendMsg(message)
        }

    }

}

let sendMsg = function (message) {
    if (response !== null && response !== "") {
        message.channel.send(myAddField(embed.getEmbed(), message.member.displayName, response)).catch(console.error);
    }
    response = "";
};
