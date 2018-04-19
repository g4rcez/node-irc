const nickname = (connection, command) => {
	console.log('Connection with nickname', connection);
	connection.color = 'white';
	let nickname = command.replace('/nickname ', '');
	let message = connection.nickname + ' is now ' + nickname;
	connection.nickname = nickname;
	return { connection, message };
};

const actions = (line, connection) => {
	const command = line.split(' ')[0].replace('/', '');
	console.log('This attr', command);
	const action = {
		nickname: () => nickname(connection, line),
	};
	try {
		return action[command](connection, line);
	} catch (e) {
		return { connection, line };
	}
};

module.exports = actions;
