//
//  ESTDistanceDemoVC.m
//  Examples
//
//  Created by Grzegorz Krukiewicz-Gacek on 17.03.2014.
//  Copyright (c) 2014 Estimote. All rights reserved.
//

#import "ESTDistanceDemoVC.h"
#import "AFNetworking.h"
#import "MJExtension.h"
#import <EstimoteSDK/ESTBeaconManager.h>
#import <EstimoteSDK/ESTBluetoothBeacon.h>
/*
 * Maximum distance (in meters) from beacon for which, the dot will be visible on screen.
 */
#define MAX_DISTANCE 20
#define TOP_MARGIN   150

@interface ESTDistanceDemoVC () <ESTBeaconManagerDelegate>

@property (nonatomic, strong) CLBeacon         *beacon;
@property (nonatomic, strong) ESTBeaconManager  *beaconManager;
@property (nonatomic, strong) CLBeaconRegion   *beaconRegion;

@property (nonatomic, strong) UIImageView       *backgroundImage;
@property (nonatomic, strong) UIImageView       *positionDot;

@end

@implementation ESTDistanceDemoVC

- (id)initWithBeacon:(CLBeacon *)beacon
{
    self = [super init];
    if (self)
    {
        self.beacon = beacon;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.title = @"Distance Demo";
    
    /*
     * UI setup.
     */
    
    self.backgroundImage = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"distance_bkg"]];
    self.backgroundImage.frame = [UIScreen mainScreen].bounds;
    self.backgroundImage.contentMode = UIViewContentModeScaleToFill;
    [self.view addSubview:self.backgroundImage];
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    UIImageView *beaconImageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"beacon"]];
    [beaconImageView setCenter:CGPointMake(self.view.center.x, 100)];
    [self.view addSubview:beaconImageView];
    
    self.positionDot = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"black_dot"]];
    [self.positionDot setCenter:self.view.center];
    [self.view addSubview:self.positionDot];
    
    
    /*
     * BeaconManager setup.
     */
    self.beaconManager = [[ESTBeaconManager alloc] init];
    self.beaconManager.delegate = self;
    
    self.beaconRegion = [[CLBeaconRegion alloc] initWithProximityUUID:self.beacon.proximityUUID
                                                                 major:[self.beacon.major unsignedIntValue]
                                                                 minor:[self.beacon.minor unsignedIntValue]
                                                            identifier:@"RegionIdentifier"];
    
    [self.beaconManager startRangingBeaconsInRegion:self.beaconRegion];
}

- (void)viewDidDisappear:(BOOL)animated
{
    [self.beaconManager stopRangingBeaconsInRegion:self.beaconRegion];
    
    [super viewDidDisappear:animated];
}

#pragma mark - ESTBeaconManager delegate

- (void)beaconManager:(id)manager didRangeBeacons:(NSArray *)beacons inRegion:(CLBeaconRegion *)region
{
    CLBeacon *firstBeacon = [beacons firstObject];
    
    [self updateDotPositionForDistance:firstBeacon.accuracy];
    [self onPostData:firstBeacon];
}

#pragma mark -

- (void)updateDotPositionForDistance:(float)distance
{
    NSLog(@"distance: %f", distance);
    
    float step = (self.view.frame.size.height - TOP_MARGIN) / MAX_DISTANCE;
    
    int newY = TOP_MARGIN + (distance * step);
    
    [self.positionDot setCenter:CGPointMake(self.positionDot.center.x, newY)];
}



-(void)onPostData:(CLBeacon*)changeBeacon
{
    AFHTTPRequestOperationManager * manager=[AFHTTPRequestOperationManager manager];
    manager.securityPolicy = [AFSecurityPolicy policyWithPinningMode:AFSSLPinningModeNone];
    manager.requestSerializer = [AFJSONRequestSerializer serializer];
    manager.responseSerializer = [AFJSONResponseSerializer serializer];
    [manager.requestSerializer setValue:@"application/json" forHTTPHeaderField:@"Accept"];
    [manager.requestSerializer setValue:@"application/json; charset=utf-8" forHTTPHeaderField:@"Content-Type"];

    
    [CLBeacon setupIgnoredPropertyNames:^NSArray *{
        return @[@"accuracy",@"proximityUUID",@"proximity"];
    }];
    

    
    NSMutableDictionary *beaconJson = [[NSMutableDictionary alloc] initWithDictionary:changeBeacon.keyValues];
    
    if (changeBeacon.proximityUUID.UUIDString) {
        [beaconJson setObject:changeBeacon.proximityUUID.UUIDString forKey:@"proximityUUID"];
     }
    
 
    [beaconJson setObject:@"iOS" forKey:@"macAddress"];
    [beaconJson setObject:@"0" forKey:@"measuredPower"];

    
    [manager POST:@"http://beacon.code4demo.com/api/beaconDistance/add"
       parameters:@{@"beacon":beaconJson,@"distance":@(changeBeacon.accuracy)}
          success:^(AFHTTPRequestOperation *operation, id responseObject) {
              NSLog(@"%@",responseObject);
          }
          failure:^(AFHTTPRequestOperation *operation, NSError *error) {
              NSLog(@"%@",error);

          }];
    
}
@end
