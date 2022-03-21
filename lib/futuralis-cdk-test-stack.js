"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuturalisTestStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigw = require("aws-cdk-lib/aws-apigateway");
const cognito = require("aws-cdk-lib/aws-cognito");
class FuturalisTestStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        let lambdaPythonCode = `def handler(event, context):
    return {
        "statusCode": 200,
        "body": 'hello world'
    }`;
        let lambdaFn = new lambda.Function(this, 'lambdaFn', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'index.handler',
            code: lambda.Code.fromInline(lambdaPythonCode),
        });
        let gateway = new apigw.LambdaRestApi(this, 'gateway', {
            handler: lambdaFn,
            proxy: false,
        });
        let userPool = new cognito.UserPool(this, 'userpool', {
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
            },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        let domain = new cognito.UserPoolDomain(this, 'domain', {
            userPool,
            cognitoDomain: {
                domainPrefix: 'futuralis-test',
            },
        });
        let cognitoClient = new cognito.UserPoolClient(this, 'cognitoClient', {
            userPool,
            authFlows: {
                userPassword: true,
            },
            oAuth: {
                callbackUrls: [gateway.url],
                flows: {
                    implicitCodeGrant: true,
                },
            },
        });
        let authorizer = new apigw.CognitoUserPoolsAuthorizer(this, 'authorizer', {
            cognitoUserPools: [userPool],
        });
        gateway.root.addMethod('GET', undefined, {
            authorizer,
            authorizationType: apigw.AuthorizationType.COGNITO,
        });
    }
}
exports.FuturalisTestStack = FuturalisTestStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnV0dXJhbGlzLWNkay10ZXN0LXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZnV0dXJhbGlzLWNkay10ZXN0LXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFrQztBQUVsQyxpREFBZ0Q7QUFDaEQsb0RBQW1EO0FBQ25ELG1EQUFrRDtBQUVsRCxNQUFhLGtCQUFtQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQy9DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFFdkIsSUFBSSxnQkFBZ0IsR0FBRzs7OztNQUlyQixDQUFBO1FBRUYsSUFBSSxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDbkQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7U0FDL0MsQ0FBQyxDQUFBO1FBRUYsSUFBSSxPQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDckQsT0FBTyxFQUFFLFFBQVE7WUFDakIsS0FBSyxFQUFFLEtBQUs7U0FDYixDQUFDLENBQUE7UUFFRixJQUFJLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNwRCxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLGFBQWEsRUFBRTtnQkFDYixLQUFLLEVBQUUsSUFBSTthQUNaO1lBQ0QsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztTQUN6QyxDQUFDLENBQUE7UUFFRixJQUFJLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUN0RCxRQUFRO1lBQ1IsYUFBYSxFQUFFO2dCQUNiLFlBQVksRUFBRSxnQkFBZ0I7YUFDL0I7U0FDRixDQUFDLENBQUE7UUFFRixJQUFJLGFBQWEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUNwRSxRQUFRO1lBQ1IsU0FBUyxFQUFFO2dCQUNULFlBQVksRUFBRSxJQUFJO2FBQ25CO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7Z0JBQzNCLEtBQUssRUFBRTtvQkFDTCxpQkFBaUIsRUFBRSxJQUFJO2lCQUN4QjthQUNGO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsSUFBSSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUN4RSxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQztTQUM3QixDQUFDLENBQUE7UUFFRixPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ3ZDLFVBQVU7WUFDVixpQkFBaUIsRUFBRSxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTztTQUNuRCxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0Y7QUExREQsZ0RBMERDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJ1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cydcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJ1xuaW1wb3J0ICogYXMgYXBpZ3cgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknXG5pbXBvcnQgKiBhcyBjb2duaXRvIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2duaXRvJ1xuXG5leHBvcnQgY2xhc3MgRnV0dXJhbGlzVGVzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpXG5cbiAgICBsZXQgbGFtYmRhUHl0aG9uQ29kZSA9IGBkZWYgaGFuZGxlcihldmVudCwgY29udGV4dCk6XG4gICAgcmV0dXJuIHtcbiAgICAgICAgXCJzdGF0dXNDb2RlXCI6IDIwMCxcbiAgICAgICAgXCJib2R5XCI6ICdoZWxsbyB3b3JsZCdcbiAgICB9YFxuXG4gICAgbGV0IGxhbWJkYUZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnbGFtYmRhRm4nLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM185LFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZShsYW1iZGFQeXRob25Db2RlKSxcbiAgICB9KVxuXG4gICAgbGV0IGdhdGV3YXkgPSBuZXcgYXBpZ3cuTGFtYmRhUmVzdEFwaSh0aGlzLCAnZ2F0ZXdheScsIHtcbiAgICAgIGhhbmRsZXI6IGxhbWJkYUZuLFxuICAgICAgcHJveHk6IGZhbHNlLFxuICAgIH0pXG5cbiAgICBsZXQgdXNlclBvb2wgPSBuZXcgY29nbml0by5Vc2VyUG9vbCh0aGlzLCAndXNlcnBvb2wnLCB7XG4gICAgICBzZWxmU2lnblVwRW5hYmxlZDogdHJ1ZSxcbiAgICAgIHNpZ25JbkFsaWFzZXM6IHtcbiAgICAgICAgZW1haWw6IHRydWUsXG4gICAgICB9LFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KVxuXG4gICAgbGV0IGRvbWFpbiA9IG5ldyBjb2duaXRvLlVzZXJQb29sRG9tYWluKHRoaXMsICdkb21haW4nLCB7XG4gICAgICB1c2VyUG9vbCxcbiAgICAgIGNvZ25pdG9Eb21haW46IHtcbiAgICAgICAgZG9tYWluUHJlZml4OiAnZnV0dXJhbGlzLXRlc3QnLFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgbGV0IGNvZ25pdG9DbGllbnQgPSBuZXcgY29nbml0by5Vc2VyUG9vbENsaWVudCh0aGlzLCAnY29nbml0b0NsaWVudCcsIHtcbiAgICAgIHVzZXJQb29sLFxuICAgICAgYXV0aEZsb3dzOiB7XG4gICAgICAgIHVzZXJQYXNzd29yZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBvQXV0aDoge1xuICAgICAgICBjYWxsYmFja1VybHM6IFtnYXRld2F5LnVybF0sXG4gICAgICAgIGZsb3dzOiB7XG4gICAgICAgICAgaW1wbGljaXRDb2RlR3JhbnQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICBsZXQgYXV0aG9yaXplciA9IG5ldyBhcGlndy5Db2duaXRvVXNlclBvb2xzQXV0aG9yaXplcih0aGlzLCAnYXV0aG9yaXplcicsIHtcbiAgICAgIGNvZ25pdG9Vc2VyUG9vbHM6IFt1c2VyUG9vbF0sXG4gICAgfSlcblxuICAgIGdhdGV3YXkucm9vdC5hZGRNZXRob2QoJ0dFVCcsIHVuZGVmaW5lZCwge1xuICAgICAgYXV0aG9yaXplcixcbiAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcGlndy5BdXRob3JpemF0aW9uVHlwZS5DT0dOSVRPLFxuICAgIH0pXG4gIH1cbn1cbiJdfQ==