package com.tokky.modules

import android.content.SharedPreferences
import android.os.Build
import androidx.annotation.RequiresApi
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.facebook.react.bridge.*
import java.util.*

@RequiresApi(Build.VERSION_CODES.Q)
class KeyStorageModule(private val reactContext: ReactApplicationContext?) :
    ReactContextBaseJavaModule(reactContext) {

    private val sharedPrefs by lazy { createSharedPreferences() }

    private fun createSharedPreferences(): SharedPreferences? {
        reactContext ?: return null
        return EncryptedSharedPreferences.create(
            reactContext,
            "tokky_keys",
            MasterKey.Builder(reactContext).setKeyScheme(MasterKey.KeyScheme.AES256_GCM).build(),
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
    }

    @ReactMethod
    fun keyExists(identifier: String, promise: Promise) {
        val contains = sharedPrefs?.contains(identifier)
        promise.resolve(contains)
    }

    @ReactMethod
    fun storeKey(identifier: String, key: String, updateIfExists: Boolean, promise: Promise) {
        if (updateIfExists) {
            sharedPrefs?.edit()?.putString(identifier, key)?.apply()
            promise.resolve(null)
            return
        }

        if (sharedPrefs?.contains(identifier) == true) {
            promise.reject(Exception("Key already exists"))
            return
        }
        sharedPrefs?.edit()?.putString(identifier, key)?.apply()
        promise.resolve(null)
    }

    @ReactMethod
    fun fetchKey(identifier: String, promise: Promise) {
        val value = sharedPrefs?.getString(identifier, null)

        if (value == null) {
            promise.reject(Exception("Key not found"))
            return
        }
        promise.resolve(value)
    }

    @ReactMethod
    fun deleteKey(identifier: String, promise: Promise) {
        if (sharedPrefs?.contains(identifier) == false) {
           promise.reject(Exception("Failed to delete key from Keychain"))
        }
        sharedPrefs?.edit()
            ?.remove(identifier)
            ?.apply()
        promise.resolve(null)
    }

    override fun getName(): String {
        return "KeychainManager"
    }
}