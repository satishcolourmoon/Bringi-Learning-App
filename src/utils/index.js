import { baseUrl } from '../constants';
import qs from 'qs';
export function apiCall(postData) {
    const json = fetch(baseUrl + 'user', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'content-type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify(postData)
    }).
        then((response) => response.json()).
        catch((error) => {
            alert(JSON.stringify(error))
        });
    return json;
}