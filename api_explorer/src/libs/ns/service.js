import { TypeData, PropData, MethodData, ServiceData, ModelData, ApplicationData, Error, Result } from './dto';
import { ServiceError } from './errors'


const SERVER_URL = 'localhost:8000';
const APPLICATION_DATA_URI = 'application'


class BaseService {
    async get_structure() {
        const requestInfo = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                service, method, args,
            }),
        };
        const response = await fetch(`${SERVER_URL}/${service}/${method}/`, requestInfo);
        const result = new Result(await response.json());
        if (result.ok) {

        } else {
            throw new ServiceError(result.error.error_code, result.error.data);
        }
    }
}
