const config = require('./../config');
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('cookie-session')
const bodyParser = require('body-parser');// Requset parse to json
const debug = require('debug')('dev-svr'); // Debug logger
const morgan = require('morgan'); // Access logger manage
const rfs = require('rotating-file-stream'); // Access log rotate
const Service = require('./server-service');

const PORT = process.env.NODE_ENV=='production' ? config.app.prodPort : config.app.devPort;
const APP_DIR =  process.env.NODE_ENV=='production' ? __dirname + './../public' : __dirname + './../build';
const INDEX_FILE = path.resolve(APP_DIR, 'index.html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/****************************************
 Debug log 
****************************************/
if (debug.enabled) {
  debug("Debug is enable")
}
const logger = (req, res, next) => {
  debug("Request: " + req.method + " " + req.originalUrl);
  return next();
}
if (process.env.NODE_ENV != 'production') {
  app.use(logger);  
}

/****************************************
 Access log 
****************************************/
const accessLogStream = rfs('access.log', {
  size: '10M', // rotate every 10 MegaBytes written
  interval: '1d', // rotate daily
  compress: 'gzip', // compress rotated files
  path: config.app.logdir
})
app.use(morgan('combined', {stream: accessLogStream}));

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
}));

/****************************************
 Websocket
****************************************/
const WS = io
  .of('/ws')
  .on('connection', function (socket) {
    debug("WS connected!");
    socket.on('disconnect', function () {
      debug("WS disconnected.");
    });
  });

/****************************************
 App Route
****************************************/

/* Login */
app.get('/login', (req, res, next) => {
  try {
    req.session && req.session.usr ? res.redirect('/intra') : res.sendFile(APP_DIR + 'index.html');    
  } catch(err) { next(err); }
});

app.post('/login', async (req, res, next) => {
  try {
    if (!req.body.mail || !req.body.pass) { res.redirect('/login'); }
    const result = await Service.login(req.body);
    if (result.isPass) {
      debug("login success!");
      req.session.usr = req.body.mail;
      res.redirect('/intra?mail=' + req.body.mail);
    } else if (result.isUsr) {
      res.redirect('/login?mail=' + req.body.mail + '&pass=' + req.body.pass + '&isUsr=true');
    } else {
      res.redirect('/login?mail=' + req.body.mail + '&pass=' + req.body.pass + '&isUsr=false');
    }
  } catch(err) { next(err); }
});

app.get('/intra', (req, res, next) => {
  try {
    req.session && req.session.usr ? res.sendFile(INDEX_FILE) : res.redirect('/login');
  } catch(err) { next(err); }
});

/* News */
app.get('/api/news', async (req, res, next) => {
  try {
    const news = await Service.getAllNews(req.body);
    news.length != 0 ? res.json({ news: news }) : res.status(404).send("Sorry can't find news!");
  } catch(err) { next(err); }
});

app.post('/api/news', async (req, res, next) => {
  try {
    const news  = await Service.insertNews(req.body);
    res.json({ result: "succeed", news: news });
    WS.emit('news', { type: "new", news: news });
  } catch(err) { next(err); }
});

app.delete('/api/news/:id', async (req, res, next) => {
  try {
    await Service.deleteNews(req.params);
    res.json({ result: "succeed", news: req.params.id});
    WS.emit('news', { type: "delete", id: req.params.id });
  } catch(err) { next(err); }
});

app.put('/api/news', async (req, res, next) => {
  try {
    const news = await Service.updateNews(req.body);
    res.json({ result: "succeed", news: news });
    WS.emit('news', { type: "update", news: news });
  } catch(err) { next(err); }
});

/* Links */
app.get('/api/links', async (req, res, next) => {
  try {
    const links = await Service.getAllLinks(req.body);
    links.length != 0 ? res.json({ links: links }) : res.status(404).send("Sorry can't find links!");
  } catch(err) { next(err); } 
});

app.post('/api/link', async (req, res, next) => {
  try {
    const link = await Service.insertLink(req.body);
    res.json({ result: "succeed", link: link });
    WS.emit('links', { type: "new", link: link });
  } catch(err) { next(err); }
});

app.delete('/api/link/:id', async (req, res, next) => {
  try {
    await Service.deleteLink(req.params);
    res.json({ result: "succeed", link: req.params.id});
    WS.emit('links', { type: "delete", id: req.params.id });
  } catch(err) { next(err); }
});

app.put('/api/link', async (req, res, next) => {
  try {
    const link = await Service.updateLink(req.body);
    res.json({ result: "succeed", link: link });
    WS.emit('links', { type: "update", link: link });
  } catch(err) { next(err); }
});

/* Meetings */
app.get('/api/meetings', async (req, res, next) => {
  try {
    const meetings = await Service.getAllMeetings(req.body);
    meetings.length != 0 ? res.json({ meetings: meetings }) : res.status(404).send("Sorry can't find meetings!");
  } catch(err) { next(err); }
});

app.post('/api/meeting', async (req, res, next) => {
  try {
    const meeting = await Service.insertMeeting(req.body);
    res.json({ result: "succeed", meeting: meeting });
    WS.emit('meetings', { type: "new", meeting: meeting });
  } catch(err) { next(err); }
});

app.delete('/api/meeting/:id', async (req, res, next) => {
  try {
    await Service.deleteMeeting(req.params);
    res.json({ result: "succeed", id: req.params.id});
    WS.emit('meetings', { type: "delete", id: req.params.id });
  } catch(err) { next(err); }
});

app.put('/api/meeting', async (req, res, next) => {
  try {
    const meeting = await Service.updateMeeting(req.body);
    res.json({ result: "succeed", meeting: meeting });
    WS.emit('meetings', { type: "update", meeting: meeting });
  } catch(err) { next(err); }
});

// Static files
app.use(express.static(APP_DIR));

app.get('*', (req, res, next) => {
  try { res.redirect('/login'); } 
  catch(err) { next(err); }
});

/****************************************
 Handle error
****************************************/
app.use(function (err, req, res, next) {
  debug(err.message);
  res.status(500).send('500: Something broke on Server!');
});


http.listen(PORT, () => {
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

