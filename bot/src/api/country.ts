import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
const url: string = 'https://restcountries.eu/rest/v2/name';

export const country = (request: Request, response: Response, next: NextFunction) => {
	response.setHeader('Content-Type', 'application/json');
	const country: string = request.params.country;
	axios.get(`${url}/${country}`).then((countryResponse) => {
		const list = countryResponse.data.map((item: any) => {
			return {
				name: item.name,
				region: item.region,
				population: item.population,
				nativeName: item.nativeName,
				capital: item.capital,
			};
		});
		response.json(list);
	});
};
