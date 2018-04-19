const net = require('net');
const axios = require('axios');
let connections = [];
const arguments = process.argv.slice(2);
filterArgument = (argumentArray, search) => {
	return argumentArray
		.filter((item) => item.startsWith(search))
		.toString()
		.split('=')[1];
};
definePort = (port) => {
	return port < 65535 && port > 1024 ? port : 6667;
};
let port = !!filterArgument(arguments, '-p') ? filterArgument(arguments, '-p') : filterArgument(arguments, '--port');
port = definePort(port);

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

let cleanerMessage = (string) => {
	return;
};

let broadcast = function(message, origin) {
	connections.forEach(function(connection) {
		if (connection === origin) {
			if (connection.forAll === false) {
				connection.write(message);
				return;
			}
			return;
		}
		connection.write(message);
	});
};
net
	.createServer(function(connection) {
		connections.push(connection);
		connection.on('data', function(message) {
			var command = message.toString();
			if (command.startsWith('/nickname')) {
				connection.color = 'white';
				var nickname = command.replace('/nickname ', '');
				broadcast(connection.nickname + ' is now ' + nickname);
				connection.nickname = nickname;
				return;
			} else if (command.startsWith('/me')) {
				broadcast(colorize(`${connection.nickname}: ${command.split('/me ')[1]}`).bgBlue);
			} else if (command.startsWith('/color')) {
				let color = command.split('/color ')[1];
				broadcast(`${colorize(connection.nickname)[color]} now is ${color}`, connection);
				connection.color = color;
				return;
			} else if (command.startsWith('/git')) {
				const user = command.split('/git ')[1];
				axios.get(`https://api.github.com/users/${user}`).then((response) => {
					console.log(response.data.blog);
					connection.forAll = false;
					broadcast(response.data.blog, connection);
					connection.forAll = true;
				});
			}
			if (!!message) {
				console.log(colorize(connection.nickname)[connection.color] + colorize(' >>> ' + message).white);
				broadcast(
					`\n${colorize(connection.nickname)[connection.color]} ${colorize(' >>> ' + message).white}`,
					connection,
				);
			}
		});
		connection.on('end', function() {
			broadcast(connection.nickname + ' has left!', connection);
			connections.splice(connections.indexOf(connection), 1);
		});
	})
	.listen(port);
