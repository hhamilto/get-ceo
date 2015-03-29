var request = require('request');
var express = require('express');
var cheerio = require('cheerio');
var _ = require('lodash');

var app = express();


app.get('/companies/:ticker/executives', function(req, res){
	request.get('http://www.bloomberg.com/research/stocks/people/people.asp?ticker='+req.params.ticker,function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(body);
			var ceos = [];
			$('#keyExecs tr').each(function(){
				var member = $(this).find('td:nth-child(1)');
				if(member.find('span[itemprop=member]').length == 0)
					return
				var title = $(this).find('td:nth-child(3)');
				var age = $(this).find('td:nth-child(4)');
				ceos.push({
					name: member.text().trim().replace(/\s+/,' '),
					title: title.text(),
					age: parseInt(age.text())
				})
			})
			res.json(ceos);
		}else{
			console.log("[Error] "+error);
			res.status(500).end();
		}
	})
});


app.get('/about', function(req, res){
	res.send('This api just scrapes the bloomberg site and presents the info in a better way. ');
});

module.exports.start = function(){
	app.listen(3000);
	console.log("Server listening on port 3000");
}

_.bindAll(module.exports)