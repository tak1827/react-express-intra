const config = require('./config');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const debug = require('debug')('dev-svr-srv'); // Debug logger


/****************************************
 Login
****************************************/
exports.login = (params) => {
  return new Promise(res => {
    const csvPath = path.resolve(__dirname, config.env.csvUsrs);
    fs.stat(csvPath, (err, stat) => {
      if (err) {
        debug(err);
        return res(false);
      }
      let stream = fs.createReadStream(csvPath);
      stream
        .pipe(csv())
        .on('data', (data) => {
          if (data.MAIL == params.mail) {
            stream.pause();
            if (data.PASSWORD == params.pass) {
              return res({isUsr: true, isPass: true});
            }
            return res({isUsr: true, isPass: false});
          }
        })
        .on('end', () => {
          return res({isUsr: false, isPass: false});
        })
    });
  });
}

/****************************************
 Get all news
****************************************/
exports.getAllNews = (params) => {
  return new Promise(res => {
      const csvPath = path.resolve(__dirname, config.env.csvNews);
      fs.stat(csvPath, (err, stat) => {
        if (err) {
          debug(err);
          return res([]);
        }
        let stream = fs.createReadStream(csvPath);
        let news = [];
        stream
          .pipe(csv())
          .on('data', (data) => {
            let format = {
              id: data.ID,
              date: new Date(data.DATE),
              important: data.IMPORTANT,
              title: data.TITLE,
              contents: data.CONTENTS
            }
            news.push(format);
          })
          .on('end', () => {
            news.sort((a, b) => {return a.date - b.date});
            return res(news);
          });
      });
  });
}

/****************************************
 Insert news
****************************************/
exports.insertNews = (params) => {
  return new Promise(res => {
    const id = (new Date()).getTime() + ",";
    const data = new Date() + ",";
    const important = params.important + ",";
    const title = "\"" + params.title + "\",";
    const contents = "\"" + params.contents + "\",\n";
    const row = id + data + important + title + contents
    const csvPath = path.resolve(__dirname, config.env.csvNews);
    fs.stat(csvPath, (err, stat) => {
      if (err) {
        debug(err);
        return res(false);
      }
      fs.appendFile(csvPath, row, (err) => {
        if (err) {
          debug(err);
          return res(false);
        }
        debug("")
        return res(true);
      });
    });
  });
}

/****************************************
 Get all links
****************************************/
exports.getAllLinks = (params) => {
  return new Promise(res => {
    const csvPath = path.resolve(__dirname, config.env.csvLinks);
    fs.stat(csvPath, (err, stat) => {
      if (err) {
        debug(err);
        return res([]);
      }
      let stream = fs.createReadStream(csvPath);
      let links = [];
      stream
        .pipe(csv())
        .on('data', (data) => {
          let format = {
            id: data.ID,
            category: data.CATEGORY,
            name: data.NAME,
            path: data.PATH
          }
          links.push(format);
        })
        .on('end', () => {
          links.sort((a, b) => {
            if (a.category < b.category)
              return -1
            if ( a.category > b.category)
              return 1
            return 0
          });
          return res(links);
        });
    });
  });
}

/****************************************
 Insert link
****************************************/
exports.insertLink = (params) => {
  return new Promise(res => {
      const id = (new Date()).getTime() + ",";
      const category = "\"" + params.category + "\",";
      const name = "\"" + params.name + "\",";
      const p = "\"" + params.path + "\",\n";
      const row = id + category + name + p
      const csvPath = path.resolve(__dirname, config.env.csvLinks);
      fs.stat(csvPath, (err, stat) => {
        if (err) {
          debug(err);
          return res(false);
        }
        fs.appendFile(csvPath, row, (err) => {
          if (err) {
            debug(err);
            return res(false);
          }
          debug("")
          return res(true);
        });
      });
  });
}

/****************************************
 Get all meetings
****************************************/
exports.getAllMeetings = (params) => {
  return new Promise(res => {
    const csvPath = path.resolve(__dirname, config.env.csvMeetings);
    fs.stat(csvPath, (err, stat) => {
      if (err) {
        debug(err);
        return res([]);
      }
      let stream = fs.createReadStream(csvPath);
      let meetings = [];
      stream
        .pipe(csv())
        .on('data', (data) => {
          if (new Date(data.END_DATETIME) < new Date()) {
            return;
          }
          let format = {
            id: data.ID,
            start: new Date(data.START_DATETIME),
            end: new Date(data.END_DATETIME),
            room: data.ROOM,
            mail: data.MAIL,
            info: data.INFO,
            any: data.ANYONE_DELETABLE
          }
          meetings.push(format);
        })
        .on('end', () => {
          meetings.sort((a, b) => {return a.start - b.start});
          return res(meetings);
        });
    });
  });
}

/****************************************
 Insert meeting
****************************************/
exports.insertMeeting = (params) => {
  return new Promise(res => {
    const id = (new Date()).getTime() + ",";
    const start = params.start + ",";
    const end = params.end + ",";
    const room = "\"" + params.room + "\",";
    const mail = "\"" + params.mail + "\",";
    const info = "\"" + params.info + "\",";
    const any = params.any + ",\n";
    const row = id + start + end + room + mail + info + any
    const csvPath = path.resolve(__dirname, config.env.csvMeetings);
    fs.stat(csvPath, (err, stat) => {
      if (err) {
        debug(err);
        return res(false);
      }
      fs.appendFile(csvPath, row, (err) => {
        if (err) {
          debug(err);
          return res(false);
        }
        debug("")
        return res(true);
      });
    });
  });
}
