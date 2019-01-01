const transforQuestions = require('./transformQuestionsCsv');

const fileName = (process.env.FILENAME || 'sample.csv');
const validate = (process.env.V || false);
const domain = (process.env.DOMAIN || 'http://localhost:8000');

transforQuestions.transformQuestionsFromCsv(fileName, validate, domain, (err, result) =>{
	if (err) {
		console.log("error in trnasform to csv ERROR::", err);
		return;
	} else {
		console.log(`successfully transformed ${JSON.stringify(result, null, '')}`);
	}
});