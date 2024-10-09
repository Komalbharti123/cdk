// Create RDSStack class
import { StackProps, Stack, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Credentials, DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion } from 'aws-cdk-lib/aws-rds';

export class RDSStack extends Stack {
    // public readonly dbInstance: DatabaseInstance;
    // public readonly dbSecretArn: string | undefined;
    public readonly rds: DatabaseInstance;

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);
        const vpc = Vpc.fromLookup(this, 'DefaultVpc', { isDefault: true })
        const publicSubnets = vpc.selectSubnets({ subnetType: SubnetType.PUBLIC });

        this.rds = new DatabaseInstance(this, 'RDS', {
            engine: DatabaseInstanceEngine.mysql({
                version: MysqlEngineVersion.VER_8_0
            }),
            vpc,
            vpcSubnets: publicSubnets,
            instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.MICRO),
            allocatedStorage: 20,
            credentials: Credentials.fromGeneratedSecret('admin'),
            databaseName: 'myDatabase',
            removalPolicy: RemovalPolicy.DESTROY,
            publiclyAccessible: true
        })

        new CfnOutput(this, 'RDSHost', { value: this.rds.dbInstanceEndpointAddress, description: 'RDS Host' })
        // this.dbSecretArn = this.dbInstance.secret ? this.dbInstance.secret.secretArn : undefined;
    }

}