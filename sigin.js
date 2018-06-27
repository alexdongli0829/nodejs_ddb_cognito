    global.fetch = require('node-fetch');
    var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

    var poolData = { UserPoolId : 'ap-southeast-2_2f9ZJn2Tn',
        ClientId : '7b56nm5mrarldha4urjdtboh02'
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	
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
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
			console.log(accessToken)
        },
 
        onFailure: function(err) {
            console.log(err);
        },
        mfaRequired: function(codeDeliveryDetails) {
            var verificationCode = prompt('Please input verification code' ,'');
            cognitoUser.sendMFACode(verificationCode, this);
        }
    });
