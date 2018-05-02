const net = require('net');
const axios = require('axios');
const filters = require('./filters');
const args = process.argv.slice(2);
const colorize = require('./colorize');
const botUrl = 'http://127.0.0.1:3000';
let port = filters.listen(args, '-p') || filters.listen(args, '--port') || 6667;
let connections = [];
console.log('Server start at', port);

let botBroadcast = function(message, origin) {
	connections.forEach(function(connection) {
		connection.write(colorize(message).bgBlue);
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
			let messageForAll =
				colorize(connection.nickname)[color] + ': ' + message.toString().replace('/me ', '');
			broadcast(colorize(messageForAll).bgBlue, connection);
		},
		color: () => {
			let color = message.split('/color ')[1];
			connection.forAll = true;
			botBroadcast(`${colorize(connection.nickname)[color]} now is ${color}`, connection);
			connection.color = color;
		},
		git: () => {
			let user = message.split('/git ')[1];
			axios
				.get(`${botUrl}/git/${user}`)
				.then((response) => {
					console.log(response.data);
					botBroadcast(response.data.blog);
				})
				.catch((error) => console.log(error));
		},
		expression: () => {
			let expression = message.split('/expression ')[1];
			axios
				.get(`${botUrl}/expression/${expression}`)
				.then((response) => botBroadcast(`${expression} = ${response.data}`))
				.catch((error) => console.log(error));
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
			let nickname = connection.nickname;
			if (connection.forAll && nickname !== undefined) {
				let color = connection.color || 'white';
				const messageForAll =
					'\n' + colorize(nickname)[color] + colorize(' >>> ' + message.toString()).white;
				broadcast(messageForAll, connection);
			}
		});
		connection.on('end', function() {
			broadcast(connection.nickname + ' has left!', connection);
			connections.splice(connections.indexOf(connection), 1);
		});
	})
	.listen(port);
