# DubBot
Testing branch.

No `package.json` because this won't be published to npm until it's stable.

# Work in progress
Most of this library is finished but I'm still working on it.

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
Commands must start with exclamation mark (!)
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


## Direct calls from the API
```js
bot.protocol.user.info('username', function(data){
	//data is the raw data returned from the server
	bot.protocol.pm.get(data._id, function(data){
		bot.protocol.pm.send(data._id, "This is a PM using the API.");
	});
});
```