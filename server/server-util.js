const config = require('./../config');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const debug = require('debug')('dev-svr-srv'); // Debug logger
const dateFormat = require('dateformat');


/****************************************
 Util
****************************************/
exports.default = {

  fileExist: function(file) {
    return new Promise((res,rej) => {
      fs.stat(file, (err, stat) => {
        err ? rej(err) : res(true);
      });
    });
  },

  appendFile: function(file, row) {
    return new Promise((res,rej) => {
      fs.appendFile(file, row, (err) => {
        err ? rej(err) : res(true);
      });
    });
  },

  copyFile: function(ori, dest) {
    return new Promise((res,rej) => {
      fs.copyFile(ori, dest, (err) => {
        err ? rej(err) : res(true);
      });
    });
  },

  sortByValue: function(arr, p, order) {
    return order == 'asc' ? arr.sort((a, b) => {return  a[p] - b[p]}) : arr.sort((a, b) => {return  b[p] - a[p]});
  },

  sortByName: function(arr, p) {
    return arr.sort((a, b) => {
      if (a[p] < b[p]) return -1;
      if (a[p] > b[p]) return 1;
      return 0;
    });
  },

  convetJsonToRow: function(data) {
    return Object.keys(data).map((key) => { return "\"" + data[key] + "\""; });
  },

  convetJsonKeyToRow: function(data) {
    return Object.keys(data).map((key) => { return "\"" + key + "\""; });
  },

  readCsv: function(csvPath) {
    return new Promise(async (res,rej) => {
      try {
        await this.fileExist(csvPath);
        res(fs.createReadStream(csvPath));
      } catch(err) { rej(err); }
    });
  },

  insertCsv: async function(csvPath, row) {
    return new Promise(async (res,rej) => {
      try {
        await this.fileExist(csvPath);
        await this.appendFile(csvPath, row);
        res(true);
      } catch(err) { rej(err); }
    });
  },

  deleteCsv: function(csvPath, csvPathBk, id) {
    return new Promise(async (res,rej) => {
      try {
        await this.fileExist(csvPath);
        await this.copyFile(csvPath, csvPathBk);
        const reader = fs.createReadStream(csvPathBk);
        const writer = fs.createWriteStream(csvPath);
        let isHeader = true;
        reader
          .pipe(csv())
          .on('data', (data) => {
            if (data.ID == id) { return; }
            let row = this.convetJsonToRow(data) + '\n';
            if (isHeader) {
              row = this.convetJsonKeyToRow(data) + '\n' + row;
              isHeader = false;
            }
            writer.write(row);
          })
          .on('end', () => { writer.end(); return res(true); })
          .on('error', (err) => { debug(err); return rej(err); });
      } catch(err) { rej(err); }
    });
  },

  updateCsv: function(csvPath, csvPathBk, params) {
    return new Promise(async (res,rej) => {
      try {
        await this.fileExist(csvPath);
        await this.copyFile(csvPath, csvPathBk);
        const reader = fs.createReadStream(csvPathBk);
        const writer = fs.createWriteStream(csvPath);
        let isHeader = true;
        let updatedData;
        reader
          .pipe(csv())
          .on('data', (data) => {
            if (data.ID == params.ID) {
              Object.keys(data).map((key) => {data[key]= params[key]!=undefined ? params[key] : data[key];});
              updatedData = data;
            }
            let row = this.convetJsonToRow(data) + '\n';
            if (isHeader) {
              row = this.convetJsonKeyToRow(data) + '\n' + row;
              isHeader = false;
            }
            writer.write(row);
          })
          .on('end', () => { writer.end(); return res(updatedData); })
          .on('error', (err) => { debug(err); return rej(err); });
      } catch(err) { debug(err); rej(err); }
    });
  },
}

// export default UtilFuncs;

