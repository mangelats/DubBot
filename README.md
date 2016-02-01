# DubBot
A simple interface to make bots for budtrack.fm

## Intalling DubBot
Package to be made and uploaded.

```
npm intall dubbot
```

## Get the package
```js
var dubbot = require('dubbot');
```

## Add a command
```js
//addCommand(name, cooldown, function(command, params, message))
dubbot.addCommand('!skip', 10, function(command, params, message){
	dubbot.currentSong.skip();
});
```

## Add a listener
```js
dubbot.on('chat', function(message) {
	console.log(h(message.time) + " " + message.sender.username + ": " + message.message);
});
dubbot.on('song', function(song) {
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