//
//  BiometricAuth.swift
//  Tokky
//
//  Created by Pruthvi on 14/05/23.
//

import Foundation
import LocalAuthentication

@objc(BiometricAuth)
class BiometricAuth: NSObject {
  
  @objc
  func enrolled(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejector reject: @escaping RCTPromiseRejectBlock
  ) {
    let context = LAContext()
    var error: NSError?
    
    var canAuthenticate = context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error)
    
    var map = [String:Any]()
    map["isAvailable"] = canAuthenticate
    
    switch context.biometryType {
      case .touchID:
        map["biometryType"] = "TouchID"
      case .faceID:
        map["biometryType"] = "FaceID"
      case .none:
        map["error"] = "Biometrics not available"
      @unknown default:
        fatalError("Unknown biometric type")
    }
    
    resolve(map)
  }
  
  @objc
  func authenticate(
    _ message: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejector reject: @escaping RCTPromiseRejectBlock
  ) {
    var map = [String:Any]()
    let context = LAContext()
    var error: NSError?
    
    if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
      context.evaluatePolicy(
        .deviceOwnerAuthenticationWithBiometrics,
        localizedReason: message
      ) { success, authenticationError in
        map["success"] = success
        
        if !success {
          map["error"] = "Failed to authenticate"
        }
        resolve(map)
      }
    } else {
      map["success"] = false
      map["error"] = "Biometrics not available"
      resolve(map)
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

