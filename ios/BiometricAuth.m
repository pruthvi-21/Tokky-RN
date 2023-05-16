//
//  BiometricAuth.m
//  Tokky
//
//  Created by Pruthvi on 14/05/23.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BiometricAuth, NSObject)

RCT_EXTERN_METHOD(enrolled:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(authenticate:(NSString *)message resolver:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject)

@end
