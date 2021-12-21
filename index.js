require('dotenv-flow').config();
var jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM();
const {document} = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);
let jsonData = require('./messages.json');


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
function init(){
    console.log(jsonData)
    let messages = jsonData
    run(messages,0)
}
function run(messages,index){
    if(index >= messages.length){
        init()
        return
    }
    status(messages.messages[index].emoji,messages.messages[index].message)
    setTimeout(function () {
        run(messages,index+1)
    },messages.messages[index].time)
    return
}
init()