import * as constance from "./action.constance";
import * as api from "../utils/apiRequest";

export const DASHBOARD_REQUEST = "DASHBOARD_REQUEST";
export const DASHBOARD_SUCCESS = "DASHBOARD_SUCCESS";
export const DASHBOARD_FAILURE = "DASHBOARD_FAILURE";

export function getRequest() {
    return {
        type: DASHBOARD_REQUEST,
        status: constance.REQUESTING
    };
}

export function getFailure(error) {
    return {
        type: DASHBOARD_FAILURE,
        error,
        status: constance.ERROR
    };
}

export function getSuccess(matches) {
    return {
        type: DASHBOARD_SUCCESS,
        matches,
        status: constance.SUCCESS
    };
}

export function getUsers() {
    return async (dispatch, getState, api ) => {
        dispatch(getRequest());
        try {
            console.log(1);
            const result = await api.get("users");
            console.log(2);

            // let resultJson = await result.json();
            // let resultBodyJson = JSON.parse(resultJson.body);
            // if (resultJson.statusCode > 400) {
            //     throw new Error(`[${result.status}] ${resultBodyJson.error}`);
            // }
            dispatch(getSuccess({a:1}));
        } catch (e) {
            dispatch(getFailure(e.message));
        }
    };
}