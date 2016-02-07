# DubBot
Testing branch.

No `package.json` because this won't be published to npm until it's stable.

# Features
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