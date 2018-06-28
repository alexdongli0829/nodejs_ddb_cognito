	global.fetch = require('node-fetch');
	const AWS = require("aws-sdk");

	var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

	var poolData = { UserPoolId : 'ap-southeast-2_2f9ZJn2Tn',
        ClientId : '7b56nm5mrarldha4urjdtboh02'
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = [];
    
    var dataEmail = {
        Name : 'email',
        Value : 'dongaws@amazon.com'
    };
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

	var cognitoUser;
    userPool.signUp('dongaws', '', attributeList, null, function(err, result){
        if (err) {
            console.log(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
    });

