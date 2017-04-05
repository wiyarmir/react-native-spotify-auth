package es.wiyarmir.rnspotifyauth;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.spotify.sdk.android.authentication.AuthenticationClient;
import com.spotify.sdk.android.authentication.AuthenticationRequest;
import com.spotify.sdk.android.authentication.AuthenticationResponse;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SpotifyAuthNativeModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final String E_NO_ACTIVITY = "E_NO_ACTIVITY";
    private static final String E_RUNTIME_ERROR = "E_RUNTIME_ERROR";
    private static final String E_AUTH_ERROR = "E_AUTH_ERROR";
    private static final String E_CANCELLED = "E_CANCELLED";

    private static final int REQUEST_CODE = 1337;

    private final List<Promise> promises = Collections.synchronizedList(new ArrayList<Promise>());

    public SpotifyAuthNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "RNSpotifyAuth";
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CODE) {
            AuthenticationResponse response = AuthenticationClient.getResponse(resultCode, data);
            switch (response.getType()) {
                // Response was successful and contains auth token
                case TOKEN:
                    resolve(response);
                    break;
                case ERROR:
                    reject(E_AUTH_ERROR, "Error during authorisation");
                    break;
                default: // cancelled
                    reject(E_CANCELLED, "User cancelled the operation");
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        // no-op
    }

    @ReactMethod
    public void launchAuth(String clientId, String redirectUri, final Promise promise) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject(E_NO_ACTIVITY, "No activity");
            return;
        }

        promises.add(promise);

        try {
            AuthenticationRequest.Builder builder = new AuthenticationRequest.Builder(clientId, AuthenticationResponse.Type.TOKEN, redirectUri);

            builder.setScopes(new String[]{});
            AuthenticationRequest request = builder.build();

            AuthenticationClient.openLoginActivity(currentActivity, REQUEST_CODE, request);
        } catch (RuntimeException e) {
            reject(E_RUNTIME_ERROR, e);
        }
    }

    private void resolve(AuthenticationResponse response) {
        WritableMap data = makeRNFriendly(response);
        List<Promise> promises = this.promises;
        for (Promise p : promises) {
            p.resolve(data);
        }
        this.promises.removeAll(promises);
    }

    private void reject(String errorCode, RuntimeException e) {
        reject(errorCode, e.getMessage());
    }

    private void reject(String errorCode, String message) {
        List<Promise> promises = this.promises;
        for (Promise p : promises) {
            p.reject(errorCode, message);
        }
        this.promises.removeAll(promises);
    }

    private WritableMap makeRNFriendly(AuthenticationResponse response) {
        WritableMap ret = Arguments.createMap();
        ret.putString(KEY_TOKEN, response.getAccessToken());
        ret.putString(KEY_CODE, response.getCode());
        ret.putString(KEY_ERROR, response.getError());
        ret.putString(KEY_STATE, response.getState());
        ret.putInt(KEY_EXPIRES_IN, response.getExpiresIn());
        return ret;
    }

    private static final String KEY_TOKEN = "token";
    private static final String KEY_CODE = "code";
    private static final String KEY_ERROR = "error";
    private static final String KEY_STATE = "state";
    private static final String KEY_EXPIRES_IN = "expiresIn";
}
