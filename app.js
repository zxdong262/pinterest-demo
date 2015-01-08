
/**
 * Module dependencies.
 */

var 

//module
express = require('express')
,bodyParser = require('body-parser')
,stylus = require('stylus')
,oneYear = 1000 * 60 * 60 * 24 * 365

//user setting
,port = 5000

// all environments
,app = express()


//middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: true
}))

// parse application/json
app.use(bodyParser.json())

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

//static files
app.use(express.static(__dirname + '/public', {
	maxAge: oneYear
}))

//stylus
app.use(stylus.middleware({
	src: __dirname + '/public/'
	,compress: true
	,force: true
}))

//view engine
app.set('view engine', 'jade')


//routes
app.get('/', function(req, res) {
	var host = 'http://' + req.hostname + (port === 80?'':':' + port)
	res.render('index', {
		host: host
	})
})

app.get('/pinterest', function(req, res) {
	var host = 'http://' + req.hostname + (port === 80?'':':' + port)
	res.render('pinterest', {
		host: host
		,res: makeFakeData(20, host)
	})
})

//ajax data
app.get('/pin', function(req, res) {
	var host = 'http://' + req.hostname + (port === 80?'':':' + port)
	,pageSize = req.query.pageSize || 12
	res.json({
		code: 0
		,data: makeFakeData(pageSize, host)
	})
})


//fake data generator
function makeFakeData(pageSize, host) {
	var arr = []
	,i = 0
	,res = []
	,i1 = 0
	,r = 0
	,len = 0
	,item

	for(;i < 20;i ++) {
		arr.push(i + 1)
	}

	for(;i1 < pageSize;i1 ++) {
		len = arr.length
		r = Math.floor(Math.random() * len)
		item = arr.splice(r, 1)
		res.push({
			imgPath: host + '/imgs/p_' + item + '.jpg'
			,title: 'p_' + item + '.jpg'
		})
	}

	return res
}

app.listen(port, function() {
	console.log('Magic happens on port ' + port)
})
