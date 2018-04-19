const net = require('net');
const axios = require('axios');
const filters = require('./filters');
const actions = require('./actions');
let connections = [];
const args = process.argv.slice(2);
let port = filters.listen(args, '-p') || filters.listen(args, '--port') || 6667;

console.log('Server start at', port);

const colorize = (...args) => ({
	black: `\x1b[30m${args.join(' ')}`,
	red: `\x1b[31m${args.join(' ')}`,
	green: `\x1b[32m${args.join(' ')}`,
	yellow: `\x1b[33m${args.join(' ')}`,
	blue: `\x1b[34m${args.join(' ')}`,
	magenta: `\x1b[35m${args.join(' ')}`,
	cyan: `\x1b[36m${args.join(' ')}`,
	white: `\x1b[37m${args.join(' ')}`,
	bgBlack: `\x1b[40m${args.join(' ')}\x1b[0m`,
	bgRed: `\x1b[41m${args.join(' ')}\x1b[0m`,
	bgGreen: `\x1b[42m${args.join(' ')}\x1b[0m`,
	bgYellow: `\x1b[43m${args.join(' ')}\x1b[0m`,
	bgBlue: `\x1b[44m${args.join(' ')}\x1b[0m`,
	bgMagenta: `\x1b[45m${args.join(' ')}\x1b[0m`,
	bgCyan: `\x1b[46m${args.join(' ')}\x1b[0m`,
	bgWhite: `\x1b[47m${args.join(' ')}\x1b[0m`,
});

let botBroadcast = function(message, origin) {
	connections.forEach(function(connection) {
		connection.write(colorize(message).bgMagenta);
	});
};

let broadcast = function(message, origin) {
	connections.forEach(function(connection) {
		if (connection === origin) return;
		connection.write(message);
	});
};

let commander = (message, connection) => {
	const command = message.split(' ')[0].replace('/', '');
	connection.forAll = false;
	const commands = {
		nickname: () => {
			const nickname = message.replace('/nickname ', '') || 'NewClient';
			let tmpNick = connection.nickname || 'New Client undefined';
			nickname === undefined
				? botBroadcast(tmpNick + ' is now ' + nickname, connection)
				: botBroadcast(connection.nickname + ' is now ' + nickname, connection);
			connection.nickname = nickname;
		},
		me: () => {
			connection.forAll = false;
			let color = connection.color || 'white';
			let messageForAll = colorize(connection.nickname)[color] + ': ' + message.toString().replace('/me ', '');
			broadcast(colorize(messageForAll).bgBlue, connection);
		},
		color: () => {
			let color = message.split('/color ')[1];
			connection.forAll = true;
			broadcast(`${colorize(connection.nickname)[color]} now is ${color}`, connection);
			connection.color = color;
		},
	};
	try {
		commands[command]();
	} catch (error) {
		connection.forAll = true;
	}
	return connection;
};

net
	.createServer(function(connection) {
		connections.push(connection);
		connection.on('data', function(message) {
			connection.forAll = true;
			connection = commander(message.toString(), connection);
			let nickname = connection.nickname; //|| 'fluffykins' + new Date().getMilliseconds();
			if (connection.forAll && nickname !== undefined) {
				let color = connection.color || 'white';
				let messageForAll = colorize(nickname)[color] + ' >>> ' + message.toString();
				broadcast(messageForAll, connection);
			}
		});
		connection.on('end', function() {
			broadcast(connection.nickname + ' has left!', connection);
			connections.splice(connections.indexOf(connection), 1);
		});
	})
	.listen(port);
