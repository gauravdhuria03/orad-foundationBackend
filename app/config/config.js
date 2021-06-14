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
			// 'ipage',//'gmail',
			username: 'sentefintech@gmail.com',
			// 'admin@healmedsolutions.com',//'jitendrak.smartdata@gmail.com',
			password: 'Abc@123#',
			// 'He@1Med11c',//'smartsdn@#$9059JM',
			
			host: 'smtp.gmail.com',
			// 'smtp.ipage.com',//'smtp.gmail.com',
			mailUsername: 'sentefintech@gmail.com',
			// 'admin@healmedsolutions.com',//'jitendrak.smartdata@gmail.com',
			verificationMail: 'sentefintech@gmail.com'
			// 'admin@healmedsolutions.com',//'jitendrak.smartdata@gmail.com'
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
		baseUrl: 'http://54.190.192.105:6094',
		backendBaseUrl: 'http://54.190.192.105:6094',
		imageBaseUrl: 'http://54.190.192.105:6094',
		
		env: 'staging',
		// smtp: {
		// 	service: 'ipage',//'gmail',
		// 	username: 'admin@healmedsolutions.com',//'jitendrak.smartdata@gmail.com',
		// 	password: 'He@1Med11c',//'smartsdn@#$9059JM',
			
		// 	host: 'smtp.ipage.com',//'smtp.gmail.com',
		// 	mailUsername: 'admin@healmedsolutions.com',//'jitendrak.smartdata@gmail.com',
		// 	verificationMail: 'admin@healmedsolutions.com',//'jitendrak.smartdata@gmail.com'
		// },
		smtp: {
			
			service: 'gmail',
			// 'ipage',//'gmail',
			username: 'sentefintech@gmail.com',
			// 'admin@healmedsolutions.com',//'jitendrak.smartdata@gmail.com',
			password: 'Abc@123#',
			// 'He@1Med11c',//'smartsdn@#$9059JM',
			
			host: 'smtp.gmail.com',
			// 'smtp.ipage.com',//'smtp.gmail.com',
			mailUsername: 'sentefintech@gmail.com',
			// 'admin@healmedsolutions.com',//'jitendrak.smartdata@gmail.com',
			verificationMail: 'sentefintech@gmail.com'
			// 'admin@healmedsolutions.com',//'jitendrak.smartdata@gmail.com'
		},
		aws_ses: {
			accessKeyId: 'AKIAJVVOL6C2WKCDKFTA',
			secretAccessKey: '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',
			region: '',
			fromName: ''
		},
	},
	prod: {
		port: 5006,
		db: {
			user: 'patientEngagement',
			password: 'patientEngagement123',
			url: 'mongodb://localhost:27017/patientEngagement'
		},
		baseUrl: 'https://mean.stagingsdei.com:5006/',
		backendBaseUrl: 'https://mean.stagingsdei.com:5006/',
		imageBaseUrl: 'https://mean.stagingsdei.com:5006',
		// imageBaseUrl: 'http://54.190.192.105:5006',
		galileo:{
			sandboxUrl:'https://sandbox.galileo-ft.com/instant/v1/',
			username:'vfoZGMdQIDoE', //client's credentials of sukhdev keys
			password:'1MV8Tf6qBya8kZHMi6Dc',
			business_id:57511,
			product_id:19191
		},
		env: 'prod',
		smtp: {
			service: 'ipage',//'gmail',
			username: 'admin@healmedsolutions.com',//'jitendrak.smartdata@gmail.com',
			password: 'He@1Med11c',//'smartsdn@#$9059JM',
			
			host: 'smtp.ipage.com',//'smtp.gmail.com',
			mailUsername: 'admin@healmedsolutions.com',//'jitendrak.smartdata@gmail.com',
			verificationMail: 'admin@healmedsolutions.com',//'jitendrak.smartdata@gmail.com'
		},
		aws_ses: {
			accessKeyId: 'AKIAJVVOL6C2WKCDKFTA',
			secretAccessKey: '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',
			region: '',
			fromName: ''
		},
	},

};
module.exports.get = function get(env) {
	return config[env] || config.default;
}
