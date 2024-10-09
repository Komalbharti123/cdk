import { App } from "aws-cdk-lib";
import { LambdaFunctionStack } from "./stacks/LambdaFunctionStack";
import { ApiGatewayStack } from "./stacks/ApiGatewayStack";
import { RDSStack } from "./stacks/RDSStack";
const app = new App();

const env = {
    region: "us-east-1",
    account: "588738573427"
};


const rdsStack = new RDSStack(app, "RDSStack",
    { env });
const lambdaStack = new LambdaFunctionStack(app, "LambdaFunctionStack", {
    rds: rdsStack.rds,
    env
});
new ApiGatewayStack(app, "apiGatewayStack", {
    lambdaIntegration: lambdaStack.lambdaIntegration,
    env
});


