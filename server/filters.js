args = (argumentArray, search) => {
	return argumentArray
		.filter((item) => item.startsWith(search))
		.toString()
		.split('=')[1];
};

listen = (port) => {
	return port < 65535 && port > 1024 ? port : 6667;
};

module.exports = { listen, args };
