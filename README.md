# DubBot
A simple interface to make bots for budtrack.fm

## Intalling dub-bot

```
npm intall dub-bot
```

## Get the package
```js
var bot = require('dub-bot');
```

## Add a command
```js
//addCommand(name, cooldown, function(command, params, message))
bot.addCommand('!skip', 10, function(command, params, message){
	bot.say("Skipping song!"); // sends a message to the chat
	bot.currentSong.skip();
});
```

## Add a listener
```js
bot.on('chat-message', function(message) {
	console.log(h(message.time) + " " + message.sender.username + ": " + message.content);
});
bot.on('song-change', function(song) {
	console.log("Now is playing: " + song.name);
});

//functions to format the time correctly
function d2(num) {
	return (num < 10) ? ("0" + num) : ("" + num);
}
function h(time) {
	return "[" + d2(time.getHours()) + ":" + d2(time.getMinutes()) + ":" + d2(time.getSeconds()) + "]";
}
```

## Connect to the room
This last step is recomended to be done at the end (so all the features are loaded when it connects).
```js
bot.connect('username', 'password', 'room');
```