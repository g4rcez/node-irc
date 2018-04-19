import { Request, Response, NextFunction } from 'express';
const fetch = require('node-fetch');
import axios from 'axios';
const url: string = 'https://api.github.com/users';

export const user = (request: Request, response: Response, next: NextFunction) => {
	response.setHeader('Content-Type', 'application/json');
	const user: string = request.params.nickname;
	axios.get(`${url}/${user}`).then((gitResponse) => {
		response.json(gitResponse.data);
	});
};
