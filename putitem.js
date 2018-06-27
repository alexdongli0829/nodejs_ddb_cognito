global.fetch = require("node-fetch");
const AWS = require("aws-sdk");                                                       
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");


var data = {
  UserPoolId: 'ap-southeast-2_2f9ZJn2Tn', // your user pool id
  ClientId: '7b56nm5mrarldha4urjdtboh02' //your App client id in user pool
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);

var userData = {
    Username : 'dongaws', // your username here
    Pool : userPool
};

  var authenticationData = {
        Username : 'dongaws', // your username here
        Password : 'Lg123456!', // your password here
    };
    var authenticationDetails =
new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    var cognitoUser =
new AmazonCognitoIdentity.CognitoUser(userData);

try {
	cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (session) {
	  console.log('session validity: ' + session.isValid());
      console.log('session token: ' + session.getIdToken().getJwtToken());


	  AWS.config.update({region: 'ap-southeast-2'}); //your application region
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : 'ap-southeast-2:1b436b7e-a7b9-4023-a4ef-fc84416f23b5', //your identity pool id
        Logins : {
          // Change the key below according to the specific region your user pool is in.
          'cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_2f9ZJn2Tn' : session.getIdToken().getJwtToken()
        }
      });
      AWS.config.credentials.get(function(err) {
        if (!err) {
          var id = AWS.config.credentials.identityId;
          console.log('Cognito Identity ID '+ id); //print the id which should be the dynamodb partition key

        // Instantiate aws sdk service objects now that the credentials have been updated
		var ddb= new AWS.DynamoDB.DocumentClient();

		// Test put and update, both has no problem: 
			
		// Call DynamoDB to add the item to the table
		var params = {
		  TableName: 'customerlist',
		  Item: {
		    'userid' : id,
		    'status' :'complete',
		  }
		};


		ddb.put(params, function(err, data) {
		  if (err) {
		    console.log("Error", err);
		  } else {
		    console.log("Success", data);
		  }
		});
		}
		else{
		  console.log(err)
		}
      });
        },
        onFailure: function(err) {
            console.log(err);
        },
        mfaRequired: function(codeDeliveryDetails) {
            var verificationCode = prompt('Please input verification code' ,'');
            cognitoUser.sendMFACode(verificationCode, this);
        }
    });
} catch (e) {
  console.log(e);
  return;
}
