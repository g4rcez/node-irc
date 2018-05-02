let net = require('net');
let address,
	os = require('os'),
	interfaces = os.networkInterfaces();
for (let dev in interfaces) {
	let interface = interfaces[dev].filter(function(details) {
		return details.family === 'IPv4' && details.internal === false;
	});
	if (interface.length > 0) address = interface[0].address;
}
filterArgument = (argumentArray, search) => {
	return argumentArray
		.filter((item) => item.startsWith(search))
		.toString()
		.split('=')[1];
};
definePort = (port) => {
	return port < 65535 && port > 1024 ? port : 6667;
};
const arguments = process.argv.slice(2);
let port = !!filterArgument(arguments, '-p')
	? filterArgument(arguments, '-p')
	: filterArgument(arguments, '--port');
let nick = !!filterArgument(arguments, '-n')
	? filterArgument(arguments, '-n')
	: filterArgument(arguments, '--nick') || 'fluffikins' + new Date().getMilliseconds();
let host = !!filterArgument(arguments, '-h')
	? filterArgument(arguments, '-h')
	: filterArgument(arguments, '--host');
port = definePort(port);

let client = net.connect(port, host);
client.on('connect', function() {
	client.write('\nNew client on chat');
	client.write('/nickname ' + nick);
});
client.on('data', function(message) {
	console.log(message.toString());
});
client.on('end', function() {
	console.log('The server has been destroy');
	process.exit();
});
process.stdin.on('readable', function() {
	let message = process.stdin.read();
	if (!message) return;
	message = message.toString().replace(/\n/, '');
	client.write(`${message}`);
});
