const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
const config = require('dotenv').config()
const prefix = '#';
const regExp = /[a-zA-Z]/g;
let settings = { method: "Get" };
//global variables due to for loop
var number;
var character;
var mask;
var item;
var background;

client.on('message', message => {
        //check to see if message starts with prefefined prefix #
    if (message.content.startsWith(`${prefix}`)) {
            //remove and use number defined by user
         number = message.content.slice( 1 );
            //check for any letters after prefix, if so do not continue
        if (regExp.test(number)) { 
            message.channel.send('not a valid AntiMask number');
        } else {
                //567 is maximum minted number currently, will try to pull this data from somewhwhere else instad of manual updates
            if (number > 567){
                message.channel.send('Mask not yet minted!')
            } else { 
                    //'masksite' is the opensea api with all data, returned in json format
                var masksite = "https://api.opensea.io/api/v1/asset/0x72bb198baab62e1f1f6b60d2bb37c63a303a58ad/" + number + "?format=json";
                    //using fetch package to pull json data
                fetch(masksite, settings)
                .then(res => res.json())
                .then((json) => {
                        //looping through all the traits as the api trait data isnt consistant in its array
                    for (var idx = 0; idx < json.traits.length; idx++) {
                        if(json.traits[idx].trait_type == 'Character') {
                            character = json.traits[idx].value;
                        } else if(json.traits[idx].trait_type == 'Background'){
                            background = json.traits[idx].value
                        } else if(json.traits[idx].trait_type == 'Item') {
                            item = json.traits[idx].value
                        } else if(json.traits[idx].trait_type == 'Mask') {
                            mask = json.traits[idx].value
                        } 
                    }
                    var image = json.image_url;
                        //embed all data into discord message
                    var Embed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('AntiMask #' + number)
                        .setURL('https://opensea.io/assets/0x72bb198baab62e1f1f6b60d2bb37c63a303a58ad/' + number)
                        .setAuthor('Hakuna Masktata', 'https://ipfs.io/ipfs/Qme9jtR4a5pMrjC5U5k1tFDXhGzub4fYuq2GJEuNghmrw9/image.png', 'https://antimasks.io')
                        .setThumbnail('https://lh3.googleusercontent.com/9j_D_ScMF28a80WnpIltw_f1Ds6KvuQ-Pq0v0UuYdWN806Ob_nxob-kofLA7AbPJGsFV4iY6yOELriUrRMkyGwWwxCk2YkFTJjeYfA=s128')
                        .addField('Background: ', '`' + background + '`')
                        .addField('character: ', '`' + character + '`')
                        .addField('Item: ', '`' + item + '`')
                        .addField('Mask: ', '`' + mask + '`')
                        .setImage(image)
                        .setFooter('BlueMoonFiction 2021', 'https://miro.medium.com/fit/c/262/262/1*UV0L5e673cNJSxHD-nZvgA.png')

                    message.channel.send(Embed);

                });
            }

        }

    }

});
//token for discord bot, stored in .env file
client.login(process.env.BOT_TOKEN);