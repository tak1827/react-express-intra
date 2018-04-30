const path = require('path');
const config = {};

config.app={};
config.app.name="intranet-test";
config.app.url="";
config.app.devPort='3000';
config.app.prodPort='443';
config.app.logdir='access-log';
config.app.prodMaxAge=1000 * 60 * 60 * 24; // 24 hour
config.app.devMaxAge=1000 * 60 * 60 * 24 * 10; // 10 day

config.admin={};
config.admin.name="tak";
config.admin.email="tamura.takayuki@persol.co.jp";

config.env={};
config.env.csvUsrs=       path.resolve(__dirname, "./db/users.csv");
config.env.csvUsrsBk=     path.resolve(__dirname, "./db/backup/users");
config.env.csvNews=       path.resolve(__dirname, "./db/news.csv");
config.env.csvNewsBk=     path.resolve(__dirname, "./db/backup/news");
config.env.csvLinks=      path.resolve(__dirname, "./db/links.csv");
config.env.csvLinksBk=    path.resolve(__dirname, "./db/backup/links");
config.env.csvMeetings=   path.resolve(__dirname, "./db/meetings.csv");
config.env.csvMeetingsBk= path.resolve(__dirname, "./db/backup/meetings");

module.exports=config
