//
//  New Relic for Mobile -- iOS edition
//
//  See:
//    https://docs.newrelic.com/docs/mobile-apps for information
//    https://docs.newrelic.com/docs/releases/ios for release notes
//
//  Copyright (c) 2013 New Relic. All rights reserved.
//  See https://docs.newrelic.com/docs/licenses/ios-agent-licenses for license details
//

#import <Foundation/Foundation.h>

/*!
 NRMAFeatureFlags
 
 These flags are used to identify New Relic features.
 
 - NRFeatureFlag_NSURLSessionInstrumentation
    Disabled by default. Flag for instrumentation of NSURLSessions.
    Currently only instruments network activity dispatched with
    NSURLSessionDataTasks and NSURLSessionUploadTasks.

- NRFeatureFlag_ExperimentalNetworkingInstrumentation
   Disabled by default. Enables experimental networking instrumentation. This
   feature may decrease the stability of applications.
 */


typedef NS_OPTIONS(unsigned long long, NRMAFeatureFlags){
    NRFeatureFlag_NSURLSessionInstrumentation           = 1 << 4,
    NRFeatureFlag_ExperimentalNetworkingInstrumentation = 1 << 13,
    NRFeatureFlag_AllFeatures                           = ~0ULL //in 32-bit land the alignment is 4bytes
};
