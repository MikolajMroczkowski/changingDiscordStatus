require('dotenv-flow').config();
var jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM();
const {document} = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);
let statusJson = require('./messages.json');


function status(emoji, text) {
    $.ajax({
        "url": "https://discord.com/api/v9/users/@me/settings",
        "headers": {
            "Content-type": "application/json",
            "authorization": process.env.TOKEN
        },
        "method": "patch",
        "data": '{"custom_status":{"text":"' + text + '","emoji_name":"' + emoji + '"}}'
    });
}

function nick(text, id) {
    $.ajax({
        "url": "https://discordapp.com/api/v8/guilds/" + id + "/members/%40me/nick",
        "headers": {
            "Content-type": "application/json",
            "authorization": process.env.TOKEN
        },
        "method": "patch",
        "data": '{"nick":"' + text + '"}'
    });
}

function statusFunction(index) {
    if (index >= statusJson.messages.length) {
        statusFunction(0)
        return
    }
    console.log("Changed status to:", statusJson.messages[index], index + 1, "of", statusJson.messages.length)
    status(statusJson.messages[index].emoji, statusJson.messages[index].message)
    setTimeout(function () {
        statusFunction(index + 1)
    }, statusJson.messages[index].time)
    return
}

function nickFunction(index, srvArrId) {
    if (index >= statusJson.nicks.servers[srvArrId].nicks.length) {
        nickFunction(0, srvArrId);
        return
    }
    console.log("Changed nick on", statusJson.nicks.servers[srvArrId].name, "to", statusJson.nicks.servers[srvArrId].nicks[index].text)
    nick(statusJson.nicks.servers[srvArrId].nicks[index].text, statusJson.nicks.servers[srvArrId].id)
    setTimeout(function () {
        nickFunction(index + 1, srvArrId)
    }, statusJson.nicks.servers[srvArrId].nicks[index].time)
    return;
}

async function Run() {
    console.log("Loaded", statusJson.messages.length, "status")
    await statusFunction(0)
    for (var x = 0; x < statusJson.nicks.servers.length; x++) {
        console.log("Loaded", statusJson.nicks.servers[x].nicks.length, "nicks for", statusJson.nicks.servers[x].name)
        await nickFunction(0, x)
    }
}
Run()