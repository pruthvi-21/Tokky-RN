//
//  KeyStoreUtils.swift
//  Tokky
//
//  Created by Pruthvi on 16/05/23.
//

import Foundation
import Security

@objc(KeychainManager)
class KeychainManager: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func keyExists(
    _ identifier: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject : @escaping RCTPromiseRejectBlock
  ) {
    let key = fetchKey(identifier)
    resolve(key != nil)
  }
  
  @objc
  func storeKey(
    _ identifier: String,
    key: String,
    updateIfExists update: Bool,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject : @escaping RCTPromiseRejectBlock
  ) {
    let result = storeKey(identifier, key:key, update:update)
    
    if result == nil {
      resolve(nil)
    } else {
      reject("keychain_error", result, nil)
    }
  }
  
  @objc
  func fetchKey(
    _ identifier: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject : @escaping RCTPromiseRejectBlock
  ) {
    let key = fetchKey(identifier)
    
    if key == nil {
      reject("keychain_error", "Failed to fetch key from Keychain.", nil)
    } else {
      resolve(key)
    }
  }
  
  @objc
  func deleteKey(
    _ identifier: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject : @escaping RCTPromiseRejectBlock
  ) {
    let keyDeleted = deleteKey(identifier)
    
    if keyDeleted {
      resolve(nil)
      return
    }
    reject("keychain_error", "Failed to delete key from Keychain.", nil)
  }
  
  
  
  //Actual funcionality
  func storeKey(_ identifier: String, key: String, update: Bool) -> String? {
    let keyData = key.data(using: .utf8)!
    
    let attributes: [String: Any] = [
      kSecClass as String               : kSecClassKey,
      kSecAttrKeyType as String         : kSecAttrKeyTypeRSA,
      kSecAttrKeyClass as String        : kSecAttrKeyClassPrivate,
      kSecAttrApplicationTag as String  : identifier.data(using: .utf8)!,
      kSecValueData as String           : keyData
    ]
    
    let status = SecItemAdd(attributes as CFDictionary, nil)
    
    if status == errSecSuccess {
      return nil
    }
    
    if status == errSecDuplicateItem && !update {
      return "Key already exists"
    }
    
    if status == errSecDuplicateItem && update {
      let updateAttributes: [String: Any] = [
        kSecValueData as String: keyData
      ]
      
      let updateStatus = SecItemUpdate(attributes as CFDictionary, updateAttributes as CFDictionary)
      if updateStatus == errSecSuccess {
        return nil
      }
    }
    
    return "Failed to store key"
  }
  
  func fetchKey(_ identifier: String) -> String? {
    let query: [String: Any] = [
      kSecClass as String               : kSecClassKey,
      kSecAttrKeyType as String         : kSecAttrKeyTypeRSA,
      kSecAttrKeyClass as String        : kSecAttrKeyClassPrivate,
      kSecAttrApplicationTag as String  : identifier.data(using: .utf8)!,
      kSecReturnData as String          : kCFBooleanTrue!,
      kSecMatchLimit as String          : kSecMatchLimitOne
    ]
    
    var result: AnyObject?
    let status = SecItemCopyMatching(query as CFDictionary, &result)
    
    if status == errSecSuccess, let data = result as? Data, let key = String(data: data, encoding: .utf8) {
      return key
    }
    return nil
  }
  
  func deleteKey(_ identifier: String) -> Bool {
    let query: [String: Any] = [
      kSecClass as String               : kSecClassKey,
      kSecAttrKeyType as String         : kSecAttrKeyTypeRSA,
      kSecAttrKeyClass as String        : kSecAttrKeyClassPrivate,
      kSecAttrApplicationTag as String  : identifier.data(using: .utf8)!
    ]
    
    let status = SecItemDelete(query as CFDictionary)
    return status == errSecSuccess
  }
  
}
