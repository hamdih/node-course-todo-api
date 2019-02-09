var env = process.env.NODE_ENV || 'development';


if(env === 'development' || env ==='test'){
	//json file to keep things hidden
	var config = require('./config.json');
	var envConfig = config[env];

	Object.keys(envConfig).forEach((key)=>{
		process.env[key] = envConfig[key];
	});
}
console.log('env *****', env);
