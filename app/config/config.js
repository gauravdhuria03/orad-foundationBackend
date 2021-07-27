'use strict';

const config = {

	//For local configuration
	local: {
		port: 4000,
		db: {
			user: '',
			password: '',
			url: 'mongodb://localhost:27017/orad'
		},
		baseUrl: 'http://localhost:4200/',
		backendBaseUrl: 'http://localhost:4000/',
		imageBaseUrl: 'http://localhost:4000',

		env: 'local',
		smtp: {
			service: 'gmail',

			username: 'sentefintech@gmail.com',

			password: 'Abc@123#',


			host: 'smtp.gmail.com',

			mailUsername: 'sentefintech@gmail.com',

			verificationMail: 'sentefintech@gmail.com'

		},
		aws_ses: {
			accessKeyId: 'AKIAJVVOL6C2WKCDKFTA',
			secretAccessKey: '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',
			region: 'us-east-1',
			fromName: '',
			//bucket:'dialogflowvoicebased',
			bucket: 'voicebased',
			endpoint: 'https://dialogflowvoicebased.s3.amazonaws.com/'

		},
	},
	//For stagging configuration
	staging: {
		port: 6094,
		db: {
			user: 'sentefintechapp',
			password: 'sent65efihgchapp',
			url: 'mongodb://54.190.192.105:27017/sentefintechapp'
		},
		baseUrl: 'https://oradfoundation.azurewebsites.net',
		backendBaseUrl: 'https://oradfoundation.azurewebsites.net',
		imageBaseUrl: 'https://oradfoundation.azurewebsites.net',

		env: 'staging',
		smtp: {
			service: 'gmail',
			username: 'sentefintech@gmail.com',
			password: 'Abc@123#',
			mailUsername: 'sentefintech@gmail.com',
			verificationMail: 'sentefintech@gmail.com'
		}
	},
	prod: {
		port: 5006,
		db: {
			user: 'patientEngagement',
			password: 'patientEngagement123',
			url: 'mongodb://localhost:27017/patientEngagement'
		},
		baseUrl: 'https://oradfoundation.azurewebsites.net',
		backendBaseUrl: 'https://oradfoundation.azurewebsites.net',
		imageBaseUrl: 'https://oradfoundation.azurewebsites.net',


		env: 'prod',
		smtp: {
			service: 'ipage',//'gmail',
			username: 'admin@healmedsolutions.com',
			password: 'He@1Med11c',

			host: 'smtp.ipage.com',
			mailUsername: 'admin@healmedsolutions.com',
			verificationMail: 'admin@healmedsolutions.com',
		}
	},

};
module.exports.get = function get(env) {
	return config[env] || config.default;
}
