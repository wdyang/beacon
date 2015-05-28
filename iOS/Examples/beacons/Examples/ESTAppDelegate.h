//
//  ESTAppDelegate.h
//  Examples
//
//  Created by Grzegorz Krukiewicz-Gacek on 17.03.2014.
//  Copyright (c) 2014 Estimote. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <EstimoteSDK/EstimoteSDK.h>

@interface ESTAppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;
@property (strong, nonatomic) UINavigationController *mainNavigation;
@property (strong, nonatomic) ESTCloudManager *cloudManager;


@end



