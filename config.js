var config = {};

config.app={};
config.app.name="intranet-test";
config.app.url="";
config.app.devPort='3000';
config.app.prodPort='80';
config.app.logdir='access-log';
config.app.prodMaxAge=1000 * 60 * 60 * 24; // 24 hour
config.app.devMaxAge=1000 * 60 * 60 * 24 * 10; // 10 day

config.admin={};
config.admin.name="tak";
config.admin.email="tamura.takayuki@persol.co.jp";

config.env={};
config.env.csvUsrs="./db/users.csv";
config.env.csvNews="./db/news.csv";
config.env.csvLinks="./db/links.csv";
config.env.csvMeetings="./db/meetings.csv";


module.exports=config
