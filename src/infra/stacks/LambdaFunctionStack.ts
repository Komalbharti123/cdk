import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';  // Import the Stack class from aws-cdk-lib
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { join } from 'path';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';

export interface LambdaStackProps extends StackProps {
    rds: {}
}
export class LambdaFunctionStack extends Stack {

    public readonly lambdaIntegration: LambdaIntegration
    constructor(scope: Construct, id: string, props?: LambdaStackProps) {
        super(scope, id, props);
        const vpc = new Vpc(this, 'CustomVPC', {
            maxAzs: 2,
            natGateways: 1,
        });
        const lambda = new LambdaFunction(this, 'myFunction', {
            functionName: 'MyLambdaFunction',
            runtime: Runtime.NODEJS_20_X,
            handler: 'hello.main',
            code: Code.fromAsset(join(__dirname, '..', '..', 'services')),
            environment: {
                DB_HOST: props.rds['dbInstanceEndpointAddress'],
                DB_USER: 'admin',
                DB_NAME: 'MyDatabase',
                SECRET_ARN: props.rds['dbSecretArn'],
            },
            vpc: Vpc.fromLookup(this, 'DefaultVPC', {
                isDefault: true,
            }),
            allowPublicSubnet: true
        })
        new CfnOutput(this, 'LambdaFunctionArn', {
            value: lambda.functionArn,
            description: 'The ARN of the Lambda function',
            exportName: 'MyLambdaFunctionArn',
        });
        this.lambdaIntegration = new LambdaIntegration(lambda)

    }
}
