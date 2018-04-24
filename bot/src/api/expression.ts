import { country } from './country';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
const url: string = 'https://restcountries.eu/rest/v2/name';

export const expression = (request: Request, response: Response, next: NextFunction) => {
	response.setHeader('Content-Type', 'application/json');
	const expression: string = request.params.expression;
	response.json(eval(expression));
};
