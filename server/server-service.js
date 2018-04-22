const config = require('./../config');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const debug = require('debug')('dev-svr-srv'); // Debug logger
const dateFormat = require('dateformat');
const U = require('./server-util').default;

/****************************************
 Login
****************************************/
exports.login = (params) => {
  return new Promise((res, rej) => {
    const csvPath = path.resolve(__dirname, config.env.csvUsrs);
    U.readCsv(csvPath).then(stream => {
      stream
        .pipe(csv())
        .on('data', (data) => {
          if (data.MAIL == params.mail && data.PASSWORD == params.pass) {
            stream.pause();
            const isAdmin = data.ADMIN=='true' ? true : false;
            return res({isUsr: true, isPass: true, isAdmin: isAdmin, usr: data});
          } else if (data.MAIL == params.mail) {
            stream.pause();
            return res({isUsr: true, isPass: false});
          }
        })
        .on('end', () => { return res({isUsr: false, isPass: false}); });
    }).catch(err => { rej(err); });
  });
}

/****************************************
 Get all news
****************************************/
exports.getAllNews = (params) => {
  return new Promise(res => {
      const csvPath = path.resolve(__dirname, config.env.csvNews);
      U.readCsv(csvPath).then(stream => {
        let news = [];
        stream
          .pipe(csv())
          .on('data', (data) => {
            data.DATE = new Date(data.DATE);
            news.push(data);
          })
          .on('end', () => { return res(U.sortByValue(news,"DATE","decs")); });
      });
  });
}

/****************************************
 Insert news
****************************************/
exports.insertNews = (params) => {
  return new Promise((res, rej) => {
    params.ID = (new Date()).getTime() + "";
    const row = U.convetJsonToRow(params) + '\n';
    const csvPath = path.resolve(__dirname, config.env.csvNews);
    U.insertCsv(csvPath, row).then(data => res(params)).catch(err => rej(err));
  });
}

/****************************************
 Delete news
****************************************/
exports.deleteNews = (params) => {
  return new Promise(res => {
    const id = params.id;
    const csvPath = path.resolve(__dirname, config.env.csvNews);
    const csvPathBk = path.resolve(__dirname, config.env.csvNewsBk + dateFormat(new Date(), "-yymmddHHMMss") + ".csv");
    U.deleteCsv(csvPath, csvPathBk, id).then(data => res(data)).catch(err => rej(err));
  });
}

/****************************************
 Update news
****************************************/
exports.updateNews = (params) => {
  return new Promise(res => {
    const csvPath = path.resolve(__dirname, config.env.csvNews);
    const csvPathBk = path.resolve(__dirname, config.env.csvNewsBk + dateFormat(new Date(), "-yymmddHHMMss") + ".csv");
    U.updateCsv(csvPath, csvPathBk, params).then(data => res(data)).catch(err => rej(err));
  });
}

/****************************************
 Get all links
****************************************/
exports.getAllLinks = (params) => {
  return new Promise(res => {
    const csvPath = path.resolve(__dirname, config.env.csvLinks);
    U.readCsv(csvPath).then(stream => {
      let links = [];
      stream
        .pipe(csv())
        .on('data', (data) => { links.push(data); })
        .on('end', () => { return res(U.sortByName(links, "CATEGORY")); });
    });
  });
}

/****************************************
 Insert link
****************************************/
exports.insertLink = (params) => {
  return new Promise(res => {
    params.ID = (new Date()).getTime() + "";
    const row = U.convetJsonToRow(params) + '\n';
    const csvPath = path.resolve(__dirname, config.env.csvLinks);
    U.insertCsv(csvPath, row).then(data => res(params)).catch(err => rej(err));
  });
}

/****************************************
 Delete link
****************************************/
exports.deleteLink = (params) => {
  return new Promise(res => {
    const id = params.id;
    const csvPath = path.resolve(__dirname, config.env.csvLinks);
    const csvPathBk = path.resolve(__dirname, config.env.csvLinksBk + dateFormat(new Date(), "-yymmddHHMMss") + ".csv");
    U.deleteCsv(csvPath, csvPathBk, id).then(data => res(data)).catch(err => rej(err));
  });
}

/****************************************
 Update link
****************************************/
exports.updateLink = (params) => {
  return new Promise(res => {
    const csvPath = path.resolve(__dirname, config.env.csvLinks);
    const csvPathBk = path.resolve(__dirname, config.env.csvLinksBk + dateFormat(new Date(), "-yymmddHHMMss") + ".csv");
    U.updateCsv(csvPath, csvPathBk, params).then(data => res(data)).catch(err => rej(err));
  });
}

/****************************************
 Get all meetings
****************************************/
exports.getAllMeetings = (params) => {
  return new Promise(res => {
    const csvPath = path.resolve(__dirname, config.env.csvMeetings);
    U.readCsv(csvPath).then(stream => {
      let meetings = [];
      stream
        .pipe(csv())
        .on('data', (data) => {
          // if (new Date(data.END_DATETIME) < new Date()) {
          //   return;
          // }
          data.START_DT = new Date(data.START_DT);
          data.END_DT = new Date(data.END_DT);
          meetings.push(data);
        })
        .on('end', () => { return res(U.sortByValue(meetings, "START_DT", "asc")); });
    });
  });
}

/****************************************
 Insert meeting
****************************************/
exports.insertMeeting = (params) => {
  return new Promise(res => {
    params.ID = (new Date()).getTime() + "";
    const row = U.convetJsonToRow(params) + '\n';
    const csvPath = path.resolve(__dirname, config.env.csvMeetings);
    U.insertCsv(csvPath, row).then(data => res(params)).catch(err => rej(err));
  });
}

/****************************************
 Delete meeting
****************************************/
exports.deleteMeeting = (params) => {
  return new Promise(res => {
    const id = params.id;
    const csvPath = path.resolve(__dirname, config.env.csvMeetings);
    const csvPathBk = path.resolve(__dirname, config.env.csvMeetingsBk + dateFormat(new Date(), "-yymmddHHMMss") + ".csv");
    U.deleteCsv(csvPath, csvPathBk, id).then(data => res(data)).catch(err => rej(err));
  });
}

/****************************************
 Update meeting
****************************************/
exports.updateMeeting = (params) => {
  return new Promise(res => {
    const csvPath = path.resolve(__dirname, config.env.csvMeetings);
    const csvPathBk = path.resolve(__dirname, config.env.csvMeetingsBk + dateFormat(new Date(), "-yymmddHHMMss") + ".csv");
    U.updateCsv(csvPath, csvPathBk, params).then(data => res(data)).catch(err => rej(err));
  });
}

/****************************************
 Get all users
****************************************/
exports.getAllUsrs = (params) => {
  return new Promise(res => {
      const csvPath = path.resolve(__dirname, config.env.csvUsrs);
      U.readCsv(csvPath).then(stream => {
        let usrs = [];
        stream
          .pipe(csv())
          .on('data', (data) => { usrs.push(data); })
          .on('end', () => { return res(U.sortByName(usrs,"MAIL")); });
      });
  });
}

/****************************************
 Insert user
****************************************/
exports.insertUsr = (params) => {
  return new Promise((res, rej) => {
    params.ID = (new Date()).getTime() + "";
    const row = U.convetJsonToRow(params) + '\n';
    const csvPath = path.resolve(__dirname, config.env.csvUsrs);
    U.insertCsv(csvPath, row).then(data => res(params)).catch(err => rej(err));
  });
}

/****************************************
 Delete news
****************************************/
exports.deleteUsr = (params) => {
  return new Promise(res => {
    const id = params.id;
    const csvPath = path.resolve(__dirname, config.env.csvUsrs);
    const csvPathBk = path.resolve(__dirname, config.env.csvUsrsBk + dateFormat(new Date(), "-yymmddHHMMss") + ".csv");
    U.deleteCsv(csvPath, csvPathBk, id).then(data => res(data)).catch(err => rej(err));
  });
}

/****************************************
 Update news
****************************************/
exports.updateUsr = (params) => {
  return new Promise(res => {
    const csvPath = path.resolve(__dirname, config.env.csvUsrs);
    const csvPathBk = path.resolve(__dirname, `${config.env.csvUsrsBk}${dateFormat(new Date(), "-yymmddHHMMss")}.csv`);
    U.updateCsv(csvPath, csvPathBk, params).then(data => res(data)).catch(err => rej(err));
  });
}
