import { NativeModules } from 'react-native';

const { RNSpotifyAuth } = NativeModules;

export default class ReactNativeSpotifyAuth {
    /**
     * @param {String} clientId
     * @param {String} redirectUri
     */
    constructor(clientId, redirectUri) {
        this.clientId = clientId;
        this.redirectUri = redirectUri;
    }
    /**
     * @returns {Promise}
     */
    startLogin() : Promise {
        return RNSpotifyAuth.launchAuth(this.clientId, this.redirectUri)
            .then(
                function (data) {
                    return new SpotifyAuthData(data.token, data.code, data.error, data.state, data.expiresIn);
                },
                function (reason){
                    return Promise.reject(reason);
                }
            );
    }
}

class SpotifyAuthData {
    token: string;
    code: string;
    error: string;
    state: string;
    expiresIn: number;
   /**
     * @param {string} token
     * @param {string} code
     * @param {string} error
     * @param {string} state
     * @param {number}    expiresIn
     */
    constructor(token: string, code: string, error: string, state: string, expiresIn: number) {
        this.token = token;
        this.code = code;
        this.error = error;
        this.state = state;
        this.expiresIn = expiresIn;
    }
}
