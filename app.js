let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const Discord = require('discord.js');
const cmds = require('./commands.js');


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const client = new Discord.Client();
const botPrefix = '$';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({game: {name: 'Torturer DrL4CO'}, status: 'online'})
        .catch(console.error);
});

client.on('message', message => {
    if (message.content.startsWith(botPrefix)) {
        //findCmd(message.content, message);
        let cmd = message.content.split(/\s+/)[0].slice(botPrefix.length).toLowerCase();
        getCmdFunction(cmd)(message);
    }
});

function getCmdFunction(cmd) {
    const COMMANDS = {
        'test': cmds.test,
        'createrole': cmds.createRole,
        'help': cmds.help,
        'presence': cmds.setPresence,
        'prison' : cmds.prison,
        'createvoicechannel' : cmds.createVoicechannel
    };
    return COMMANDS[cmd] ? COMMANDS[cmd] : () => {
    };
}

client.login("");


let setPresence = function (title) {
    client.user.setPresence({game: {name: title}, status: 'online'})
        .catch(console.error);
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

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
//client.on("debug", (e) => console.info(e));

//const myTime = require("./myTime.js");
//var json =

//console.log("time = ", myTime.getTimeFromRequest(json));
//console.log("time all : ", myTime.getTimeFromRequestAllDiscord(json));

module.exports.setPresence = setPresence;
module.exports = app;
