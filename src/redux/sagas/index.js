import { put , takeLatest , all } from 'redux-saga/effects';
import qs from 'qs';
const baseUrl = "http://demoworks.in/php/bingee/api/bringi/";
//-----------------------api for login step 2-----------------------//
function* LoginStep2(action) {
   const response =  yield fetch(baseUrl+'user', {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
    },
    body:qs.stringify({ 
        action : action.action,
        phone : action.phone,
        password : action.password
    })
    }).then((response) => response.json());
    yield put({ type: "DO_LOGIN_STEP2_RESPONSE", json:response});
}
function* doLoginStep2() {
    yield takeLatest('LOADING', LoginStep2)
}
export default function* rootSaga() {
    yield all([
        doLoginStep2()
    ]);
}