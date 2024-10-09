import { Fn, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { ApiGateway } from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";
import { Function } from 'aws-cdk-lib/aws-lambda';

interface ApiGatewayStackProps extends StackProps {
    lambdaIntegration: LambdaIntegration
}
export class ApiGatewayStack extends Stack {
    constructor(scope: Construct, id: string, props?: ApiGatewayStackProps) {
        super(scope, id, props)
        const lambdaArn = Fn.importValue('MyLambdaFunctionArn'); // Import the Lambda ARN
        const api = new RestApi(this, 'apiGatewayApi')
        const resources = api.root.addResource('getApi')
        resources.addMethod('GET', props.lambdaIntegration)
        // const lambdaFunction = Function.fromFunctionArn(this, 'ImportedFunction', lambdaArn);
        // lambdaFunction.grantInvoke(api);
    }
}

// create a new API endpoint to trigger the lambda to store data in RDS database