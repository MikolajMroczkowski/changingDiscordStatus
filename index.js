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
function run(index){
    if(index >= statusJson.messages.length){
        run(0)
        return
    }
    console.log("Changed to:",statusJson.messages[index],index+1,"of",statusJson.messages.length)
    status(statusJson.messages[index].emoji,statusJson.messages[index].message)
    setTimeout(function () {
        run(index+1)
    },statusJson.messages[index].time)
    return
}
console.log("Loaded",statusJson.messages.length,"status")
run(0)