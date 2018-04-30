const config = require('./../config');
const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('cookie-session')
const bodyParser = require('body-parser');// Requset parse to json
const debug = require('debug')('dev-svr'); // Debug logger
const morgan = require('morgan'); // Access logger manage
const rfs = require('rotating-file-stream'); // Access log rotate
const Service = require('./server-service');

const PORT = process.env.NODE_ENV=='production' ? config.app.prodPort : config.app.devPort;
const APP_DIR =  process.env.NODE_ENV=='production' ? __dirname + './../public' : __dirname + './../build';
const INDEX_FILE = path.resolve(APP_DIR, 'index.html');

/****************************************
 Server setting
****************************************/
const options = {
  key: fs.readFileSync(__dirname + '/key/private.key'),
  cert: fs.readFileSync(__dirname + '/key/certificate.pem')
};
const app = express();
const server = require('https').Server(options, app);
// const server = process.env.NODE_ENV == 'production' ? require('https').Server(options, app) : require('http').Server(app);
const io = require('socket.io')(server);

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
const requireAdmin = (req, res, next) => {
  if (req.session.admin) { return next(); }
  return res.status(403).send("No be Admin!");
}
/* Admin check */
app.get('/isAdmin', requireAdmin, (req, res, next) => {
  res.send("Is admin!");
});

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
    req.session && req.session.usr ? res.redirect('/intra') : res.sendFile(INDEX_FILE);    
  } catch(err) { next(err); }
});

app.post('/login', async (req, res, next) => {
  try {
    if (!req.body.mail || !req.body.pass) { res.redirect('/login'); }
    const result = await Service.login(req.body);
    if (result.isPass) {
      req.session.usr = result.usr.MAIL;
      if (result.isAdmin) { req.session.admin = result.usr.PASSWORD; }
      res.redirect(`/intra?mail=${result.usr.MAIL}&isAdmin=${result.isAdmin}`);
    }
    else { res.redirect(`/login?mail=${req.body.mail}&pass=${req.body.pass}&isUsr=${result.isUsr}`); }
  } catch(err) { next(err); }
});

app.get('/intra', (req, res, next) => {
  try {
    if (!req.session || !req.session.usr) { res.redirect('/login'); }
    if (req.query.mail != req.session.usr || 
       (req.query.isAdmin == "false" && req.session.admin) ||
        (req.query.isAdmin == "true" && !req.session.admin)) {
      if (req.session.admin) { res.redirect(`/intra?mail=${req.session.usr}&isAdmin=true`); };
      res.redirect(`/intra?mail=${req.session.usr}&isAdmin=false`);
    }
    res.sendFile(INDEX_FILE);
  } catch(err) { next(err); }
});

/* News */
app.get('/api/news', async (req, res, next) => {
  try {
    const news = await Service.getAllNews(req.body);
    news.length != 0 ? res.json({ news: news }) : res.status(404).send("Sorry can't find news!");
  } catch(err) { next(err); }
});

app.post('/api/news', requireAdmin, async (req, res, next) => {
  try {
    const news  = await Service.insertNews(req.body);
    res.json({ result: "succeed", news: news });
    WS.emit('news', { type: "new", news: news });
  } catch(err) { next(err); }
});

app.delete('/api/news/:id', requireAdmin, async (req, res, next) => {
  try {
    await Service.deleteNews(req.params);
    res.json({ result: "succeed", news: req.params.id});
    WS.emit('news', { type: "delete", id: req.params.id });
  } catch(err) { next(err); }
});

app.put('/api/news', requireAdmin, async (req, res, next) => {
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

app.post('/api/link', requireAdmin, async (req, res, next) => {
  try {
    const link = await Service.insertLink(req.body);
    res.json({ result: "succeed", link: link });
    WS.emit('links', { type: "new", link: link });
  } catch(err) { next(err); }
});

app.delete('/api/link/:id', requireAdmin, async (req, res, next) => {
  try {
    await Service.deleteLink(req.params);
    res.json({ result: "succeed", link: req.params.id});
    WS.emit('links', { type: "delete", id: req.params.id });
  } catch(err) { next(err); }
});

app.put('/api/link', requireAdmin, async (req, res, next) => {
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

app.get('/', (req, res, next) => {
  try { res.redirect('/login'); } 
  catch(err) { next(err); }
});

/* Users */
app.get('/api/users', requireAdmin, async (req, res, next) => {
  try {
    debug("path")
    const usrs = await Service.getAllUsrs(req.body);
    usrs.length != 0 ? res.json({ usrs }) : res.status(404).send("Sorry can't find news!");
  } catch(err) { next(err); }
});

app.post('/api/user', requireAdmin, async (req, res, next) => {
  try {
    const usr  = await Service.insertUsr(req.body);
    res.json({ result: "succeed", usr });
    WS.emit('users', { type: "new", usr });
  } catch(err) { next(err); }
});

app.delete('/api/user/:id', requireAdmin, async (req, res, next) => {
  try {
    await Service.deleteUsr(req.params);
    res.json({ result: "succeed", usr: req.params.id});
    WS.emit('users', { type: "delete", id: req.params.id });
  } catch(err) { next(err); }
});

app.put('/api/user', requireAdmin, async (req, res, next) => {
  try {
    const usr = await Service.updateUsr(req.body);
    res.json({ result: "succeed", usr });
    WS.emit('users', { type: "update", usr });
  } catch(err) { next(err); }
});

// Static files
app.use(express.static(APP_DIR));

/****************************************
 Handle error
****************************************/
app.use(function (err, req, res, next) {
  debug(err.message);
  // res.status(500).send(err.message);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

