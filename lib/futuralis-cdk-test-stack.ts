import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import * as cognito from 'aws-cdk-lib/aws-cognito'

export class FuturalisTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    let lambdaPythonCode = `def handler(event, context):
    return {
        "statusCode": 200,
        "body": 'hello world'
    }`

    let lambdaFn = new lambda.Function(this, 'lambdaFn', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.handler',
      code: lambda.Code.fromInline(lambdaPythonCode),
    })

    let gateway = new apigw.LambdaRestApi(this, 'gateway', {
      handler: lambdaFn,
      proxy: false,
    })

    let userPool = new cognito.UserPool(this, 'userpool', {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    let domain = new cognito.UserPoolDomain(this, 'domain', {
      userPool,
      cognitoDomain: {
        domainPrefix: 'futuralis-test',
      },
    })

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
    })

    let authorizer = new apigw.CognitoUserPoolsAuthorizer(this, 'authorizer', {
      cognitoUserPools: [userPool],
    })

    gateway.root.addMethod('GET', undefined, {
      authorizer,
      authorizationType: apigw.AuthorizationType.COGNITO,
    })
  }
}
