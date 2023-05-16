package com.tokky.modules

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_STRONG
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.*


@RequiresApi(Build.VERSION_CODES.Q)
class BiometricAuthModule(private val reactContext: ReactApplicationContext?) :
    ReactContextBaseJavaModule(reactContext) {

    private val biometricManager by lazy { reactContext?.let { BiometricManager.from(it) } }

    @ReactMethod
    fun enrolled(promise: Promise) {
        try {
            val canAuth = biometricManager?.canAuthenticate(BIOMETRIC_STRONG)

            val resultMap = WritableNativeMap()
            resultMap.putBoolean("isAvailable", false)
            when (canAuth) {
                BiometricManager.BIOMETRIC_SUCCESS -> {
                    resultMap.putBoolean("isAvailable", true)
                    resultMap.putString("biometryType", "Biometrics")
                }
                BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE -> {
                    resultMap.putString("error", "BIOMETRIC_ERROR_NO_HARDWARE")
                }
                BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE -> {
                    resultMap.putString("error", "BIOMETRIC_ERROR_HW_UNAVAILABLE")
                }
                BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> {
                    resultMap.putString("error", "BIOMETRIC_ERROR_NONE_ENROLLED")
                }
                BiometricManager.BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED -> {
                    resultMap.putString("error", "BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED")
                }
                BiometricManager.BIOMETRIC_ERROR_UNSUPPORTED -> {
                    resultMap.putString("error", "BIOMETRIC_ERROR_UNSUPPORTED")
                }
                BiometricManager.BIOMETRIC_STATUS_UNKNOWN -> {
                    resultMap.putString("error", "BIOMETRIC_STATUS_UNKNOWN")
                }
            }

            promise.resolve(resultMap)

        } catch (exception: Exception) {
            promise.reject("Some unknown error", exception)
        }
    }

    @ReactMethod
    fun authenticate(message: String, promise: Promise) {
        if (reactContext == null) {
            promise.reject("Null reactContext", Throwable())
            return
        }

        UiThreadUtil.runOnUiThread {

            val promptInfo = BiometricPrompt.PromptInfo.Builder()
                .setTitle("Scan your fingerprint")
                .setDescription(message)
                .setAllowedAuthenticators(BIOMETRIC_STRONG)
                .setNegativeButtonText("Cancel")
                .build()

            val authCallback = object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    val resultMap = WritableNativeMap()
                    resultMap.putBoolean("success", true)
                    promise.resolve(resultMap)
                }

                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    val resultMap = WritableNativeMap()
                    resultMap.putBoolean("success", false)
                    resultMap.putString("error", errString.toString())
                    promise.resolve(resultMap)
                }

                override fun onAuthenticationFailed() {
                    val resultMap = WritableNativeMap()
                    resultMap.putBoolean("success", false)
                    resultMap.putString("error", "Authentication failed")
                    promise.resolve(resultMap)
                }
            }

            val biometricPrompt = BiometricPrompt(
                currentActivity as FragmentActivity,
                ContextCompat.getMainExecutor(reactContext),
                authCallback
            )

            biometricPrompt.authenticate(promptInfo)
        }
    }

    override fun getName(): String {
        return "BiometricAuth"
    }
}