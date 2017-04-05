/* @flow */
import {NativeModules} from 'react-native';

const {RNSpotifyAuth} = NativeModules;

export default class ReactNativeSpotifyAuth {
  clientId: string;
  redirectUri: string;
  /**
   * @param {String} clientId
   * @param {String} redirectUri
   */
  constructor(clientId: string, redirectUri: string) {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
  }
  /**
   * @returns {Promise<SpotifyAuthData>}
   */
  startLogin(): Promise<SpotifyAuthData> {
    return RNSpotifyAuth.launchAuth(this.clientId, this.redirectUri).then(
      function(data) {
        return {
          token: data.token,
          code: data.code,
          error: data.error,
          state: data.state,
          expiresIn: data.expiresIn,
        };
      },
      reason => reason,
    );
  }
}

type SpotifyAuthData = {
  token: string,
  code: string,
  error: string,
  state: string,
  expiresIn: number,
};
