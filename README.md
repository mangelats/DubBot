# DubBot
Testing branch.

No `package.json` because this won't be published to npm until it's stable.

# Work in progress
Most of this library is finished but I'm still working on it (sorry for the documentation, I know it's not good enough).

# The basics
### Log in
```js
var bot = new DubBot('username', 'password');
```

### Join a room
```js
var room = bot.join('room url or id');
```

### Send a message to the room chat
```js
room.say("Hello!");
```

### Events
It uses the `events` `npm` module.
```js
room.on('chat-message', function(message){
	console.log("Message: " + message);
});
```

### Add a command
Commands must start with exclamation mark (!). (Thats allows to make the code more efficient and avoid unwanted calls).
```js
room.addCommand('!command', cooldown, function(args, message){
	console.log("'!command' called!");
});
```
`cooldown` is optional. If a function is called while is in cooldown, it won't trigger the function (useful to avoid chat spam).

The function returns `args` and `message` to the callback which are, respectively, the message splitted by spaces (like how it works in C with argc and arcv) and the `Message` object (the same as the `chat-message` event).


# Features overview
## Multiple accounts
```js
var bot1 = new DubBot('user1', 'password1');
var bot2 = new DubBot('user2', 'password2');
```

## Join multiple rooms
```js
var room1_1 = bot1.join('room1-url');
var room1_2 = bo11.join('room2-url');
var room2_1 = bot2.join('room1-url');
```

## Add commands
```js
//cooldown is in seconds and optional
room.addCommand('!command', cooldown, function(args, message){
	room.say(message.sender + " has activated the command!");
});
```

## Events
```js
bot.on('log in', function(){
	console.log("Logged in!");
});
room.on('chat-message', function(message){
	console.log(message.toString());
});
room.on('song-change', function(song){
	song.getLink(function(url){
		room.say("Now playing: " + song + " Its permanent link is " + url);
	});
});
```

## PM support
```js
room.addCommand('!pm', function(message){
	message.sendPM("Here is your private message");
});
bot.on('private-message', function(conversation){
	if (/^hello\!?$/i.test(conversation)) {
		conversation.send("Hello :D");
	}
});
```

## Implicit convertions
Most objects can be implicitly convertd to string, usually to some string that represents them.

An example of this is the following:
```js
room.addCommand('!command', function(args, message){
	room.say(message.sender + " has activated the command!");
});
```
`message.sender` is a `User` which will implicitly convert to it's username. `message` itself is a `Message` and will be converted to its content.


## Direct calls to the API
```js
bot.protocol.user.info('username', function(data){
	//data is the raw data returned from the server
	bot.protocol.pm.get(data._id, function(data){
		bot.protocol.pm.send(data._id, "This is a PM using the API.");
	});
});
```