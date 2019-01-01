const fs = require('fs');
const readline = require('readline');
const path = require('path');
const async = require('async');
const request = require('superagent');
const lodash = require('lodash');

function readCSVFileAndTransform(fileName, done) {
  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, './csv', fileName)),
  });

  let flag = 0;
  let headers = [];
  let formQuestion = [];

  rl.on('line', (line) => {
  	if(flag === 0) {
  		headers = line.split(',');
  	  ++flag;
  	} else {
  		let row = line.split(',');
  		let obj = {};
  		row.forEach((questionDetails, index) => {
  			obj[headers[index]] = questionDetails;
  		});
  		obj.options = obj.options.split('|');
  		formQuestion.push(obj);
    }
  }).on('close', () => {
    done(null, formQuestion);
  });
};

function postQuestionData(domain, questionObj, done) {
	let url = `${domain}/api/v1/questions`;

	console.log("This is domain", url, questionObj);
	//remove once uncomment the code
	//done(null, questionObj);
	request
	  .post(url)
	  .send(questionObj)
	  .end((err, res) => {
	  	if (err) {
	  		console.log("Errror in post the question obj", err);
	  		done(err);
	  	} else {
	  		done(null, res.body);
	  	}transformQuestionsFromCsv
	  })
};

function sendQuestionsObject(domain, transformData, done) {
	async.map(transformData, postQuestionData.bind(null, domain), (err, result) => {
		if (err) {
			console.log("Error in posting data from map", err);
			done(err);
		} else {
			done(null, result);
		}
	});
};

function transformQuestionsFromCsv(fileName, validate, domain, done) {
	async.waterfall([
		async.apply(readCSVFileAndTransform, fileName),
		((transformData, next) => {
			if (validate === false) {
				console.log(JSON.stringify(transformData));
				next({'err': 'please validate data'});
				return;
			} else {
				next(null, transformData);
			}
		}),
		async.apply(sendQuestionsObject, domain),
	], done);
};

module.exports = {
	transformQuestionsFromCsv,
	readCSVFileAndTransform,
	sendQuestionsObject,
	postQuestionData,
};
