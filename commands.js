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
    message.guild.createChannel("prisona", "voice")
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
        embedResponse.setDescription("Ma surveillance s'étendra jusqu'aux limites de ce systeme et au-delà.Plus aucune menace ne pourra nous échapper\n" +
            "A partir de maintenant, je défendrai l'Humanité à ma façon.\n" +
            "JE SUIS RASPOUTINE,Gardien de tous ceux que j'observe. je suis sans égale.\n");
        embedResponse.addField("Mes Commandes :",
            "$help : Pour voir ça\n" +
            "$team <titan,warlork,hunter> : choisie ta classe préféré et montre le aux autres\n" +
            "$time : Donne le temps present sur le discord en vocal");
        message.channel.send(embedResponse)
            .catch(console.error);
    } else {
        if (message.member.displayName != null)
            embedResponse.setAuthor(message.member.displayName);
        embedResponse.setDescription("My sight will stretch to the edge of this system and beyond. Never again will a threat go unsee.\n" +
            "From this day forward, i will defend Humanity on my onw terms.\n" +
            "I AM RASPUTIN, Guardian of all i survey. I have no equal\n");
        embedResponse.addField("My Command :",
            "$help : to see that\n" +
            "$team <titan,warlork,hunter> : Choose your favorite class\n" +
            "$time : Give time to the Discord ");
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
    tmp = tmp[1].split("prison");
    if (tmp.length === 2) {
        let roleToRemove = "";

        let myRoles = []
        for (let i = 0; i < message.member.roles.array().length; i++) {
            myRoles.push(message.member.roles.array()[i].name)
            console.log(message.member.roles.array()[i].name)
        }
        let intersection = myRoles.filter(x => roleClass.includes(x));
        console.log(intersection);
        if (intersection[0] !== roleClass[roleClass.length - 1]) {
            for (let i = 0; i < intersection.length; i++) {
                roleToRemove = message.member.guild.roles.find('name', intersection[i]);
                message.member.removeRole(roleToRemove)
                    .catch(console.error);
            }
            if (intersection.length !== 0 && roleClass.indexOf(intersection[0]) + 1 < roleClass.length) {
                message.member.addRole(message.member.guild.roles.find('name', roleClass[roleClass.indexOf(intersection[0]) + 1]))
                    .catch(console.error);
                response = tmp[1] + " à encore été mis en prison"
                sendMsg(message)
            } else {
                message.member.addRole(message.member.guild.roles.find('name', roleClass[0]))
                    .catch(console.error);
                //message.reply(tmp).catch(console.error);
                response = tmp[1] + " à été mis en prison"
                sendMsg(message)
            }
        } else {
            response = tmp[1] + " et un pd en prison"
            sendMsg(message)
        }
    }
    message.guild.members.find(function (value, key, map) {
        //console.log(key)
        //console.log(value)
        if (value.user.username === tmp[1]) {
            console.log("find")
            let oldvoiceChannelID = value.voiceChannelID;
            value.setVoiceChannel(channelIdPrison).catch(console.error);

            setTimeout(function() {
                value.setVoiceChannel(oldvoiceChannelID).catch(console.error);
            }, 10000);
        }
    });
}

let sendMsg = function (message) {
    if (response !== null && response !== "") {
        message.channel.send(myAddField(embed.getEmbed(), message.member.displayName, response)).catch(console.error);
    }
    response = "";
};
