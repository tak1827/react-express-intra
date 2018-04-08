const config = require('./config');
const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('cookie-session')
const bodyParser = require('body-parser');// Requset parse to json
const debug = require('debug')('dev-svr'); // Debug logger
const morgan = require('morgan'); // Access logger manage
const rfs = require('rotating-file-stream'); // Access log rotate
const Service = require('./server-service');

const app = express();
const PORT = process.env.NODE_ENV=='production' ? config.app.prodPort : config.app.devPort;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/****************************************
 Debug log 
****************************************/
if (debug.enabled) {
  debug("Debug is enable")
}
const logger = (req, res, next) => {
  // debug("Request:" + " [" + new Date().toString() + "] " + req.method + " " + req.originalUrl);
  debug("Request: " + req.method + " " + req.originalUrl);
  return next();
}
if (process.env.NODE_ENV != 'production') {
  app.use(logger);  
}

/****************************************
 Access log 
****************************************/
const accessLogStream = rfs('access.log', {// create a rotating write stream
  interval: '1d', // rotate daily
  path: config.app.logdir
})
app.use(morgan('combined', {stream: accessLogStream}));// setup the logger


/****************************************
 Session
****************************************/
app.use(session({
  name: 'session',
  keys: ['pptv20180401', 'intra20180401'],
  // secure: true,
  httpOnly: true,
  // expires: "",
  maxAge: process.env.NODE_ENV=='production' ? config.app.prodMaxAge : config.app.devMaxAge,
}))


app.get('/', (req, res) => {
  try {
    res.redirect('/login');
  } catch (e) {
    // if (e) throw e
    res.status(400).send('Invalid JSON string')
  }
});

app.get('/login', (req, res) => {
  if (req.session && req.session.usr) {
    res.redirect('/intra');
  }
  res.sendFile(__dirname + '/build/index.html');
});

app.post('/login', async (req, res) => {
  // debug(req.body);
  if (!req.body.mail || !req.body.pass) {
    res.redirect('/login');
  }
  const result = await Service.login(req.body);
  if (result.isPass) {
    debug("login success!");
    req.session.usr = req.body.mail;
    res.redirect('/intra?mail=' + req.body.mail);
  } else {
    debug("login fail");
    if (result.isUsr) {
      res.redirect('/login?mail=' + req.body.mail + '&pass=' + req.body.pass + '&isUsr=true');
    } else {
      res.redirect('/login?mail=' + req.body.mail + '&pass=' + req.body.pass + '&isUsr=false');
    }
  }
});

app.get('/intra', (req, res) => {
  if (req.session && req.session.usr) {
    debug("sessionUsr is " + req.session.usr);
    res.sendFile(__dirname + '/build/index.html');  
  } else {
    res.redirect('/login');  
  }
});

app.get('/api/news', async (req, res) => {
  const news = await Service.getAllNews(req.body);
  if (news.length != 0) {
    res.json({ news: news });  
  } else {
    res.status(404).send("Sorry can't find news!");
  }
});

app.post('/api/news', async (req, res) => {
  debug(req.body);
  const result = await Service.insertNews(req.body);
  if (result) {
    res.json({ result: "succeed", news: req.body });
  } else {
    res.status(500).send("Failed to create!");
  }
});

app.get('/api/links', async (req, res) => {
  const links = await Service.getAllLinks(req.body);
  if (links.length != 0) {
    res.json({ links: links });  
  } else {
    res.status(404).send("Sorry can't find links!");
  }
});

app.post('/api/link', async (req, res) => {
  debug(req.body);
  const result = await Service.insertLink(req.body);
  if (result) {
    res.json({ result: "succeed", link: req.body });
  } else {
    res.status(500).send("Failed to create!");
  }
});

app.get('/api/meetings', async (req, res) => {
  const meetings = await Service.getAllMeetings(req.body);
  if (meetings.length != 0) {
    res.json({ meetings: meetings });  
  } else {
    res.status(404).send("Sorry can't find meetings!");
  }
});

app.post('/api/meeting', async (req, res) => {
  debug(req.body);
  const result = await Service.insertMeeting(req.body);
  if (result) {
    res.json({ result: "succeed", meeting: req.body });
  } else {
    res.status(500).send("Failed to create!");
  }
});

// Static files
if (process.env.NODE_ENV == 'production') {
  app.use(express.static(__dirname + '/public'));
} else {
  app.use(express.static(__dirname + '/build'));
}

// Handle error
app.use(function (err, req, res, next) {
  debug("! Error !");
  debug(err.message);
})


app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});

// app.get('/login/:mail--:pass', async (req, res) => {
//   // debug(req.params)
//   const isUsr = await Service.login(req.params);
//   if (isUsr) {
//     debug("success!")
//     res.redirect('/intra');
//   } else {
//     res.redirect('/login');
//   }
// });

// app.get('/', function (req, res, next) {
//   // do some sync stuff
//   queryDb()
//     .then(function (data) {
//       // handle data
//       return makeCsv(data)
//     })
//     .then(function (csv) {
//       // handle csv
//     })
//     .catch(next)
// })


// app.post('/features/sift', requiresImgBase64, (req, res) => {
//   const siftImg = services.detectKeyPointsSIFT(req.params.img);
//   const siftImgBase64 = services.encodeJpgBase64(siftImg);
//   res.status(202).send({ base64Data: siftImgBase64 });
// });


// function requiresLogin(req, res, next) {
//   if (req.session && req.session.usrId) {
//     return next();
//   } else {
//     var err = new Error('You must be logged in to view this page.');
//     err.status = 401;
//     return next(err);
//   }
// }
// router.get('/profile', mid.requiresLogin, function(req, res, next) {
//   //...
// });

