const UtilFuncs = {

  /*
    Help to create toast DOM
  */
  createToastHtml: function(msg, type) {
    const elm = '<span onclick="closeTost(this)" class="'+ type +'">'+ msg +'</span>';
    return elm;
  },

  /*
    Commonize fetch with get method 
  */
  fetchGet: function(url) {
    return new Promise(res => {
      fetch(url, {
        method: 'get',
        credentials: 'include',
      }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw new Error(response.statusText || response.status);
        }
      }).then((data) => {
        console.log(data);
        return res(data);
      }).catch((error) => {
        console.error(error);
      });
    });
  },

  /*
    Commonize fetch with post method 
  */
  fetchPost: function(url, body) {
    return new Promise(res => {
      fetch(url, {
        method: 'post',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw new Error(response.statusText || response.status);
        }
      }).then((data) => {
        console.log(data);
        return res(data);
      }).catch((error) => {
        console.error(error);
        M.toast({html: this.createToastHtml(error, "fail"), displayLength: 2000});
      });
    });
  },

  /*
    Commonize fetch with post method 
  */
  fetchDelete: function(url) {
    return new Promise(res => {
      fetch(url, {
        method: 'delete',
        credentials: 'include',
      }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw new Error(response.statusText || response.status);
        }
      }).then((data) => {
        console.log(data);
        return res(data);
      }).catch((error) => {
        console.error(error);
        M.toast({html: this.createToastHtml(error, "fail"), displayLength: 2000});
      });
    });
  },

  /*
    Commonize fetch with put method 
  */
  fetchPut: function(url, body) {
    return new Promise(res => {
      fetch(url, {
        method: 'put',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw new Error(response.statusText || response.status);
        }
      }).then((data) => {
        console.log(data);
        return res(data);
      }).catch((error) => {
        console.error(error);
        M.toast({html: this.createToastHtml(error, "fail"), displayLength: 2000});
      });
    });
  },

  /*
    Rapper fetch post or put
  */
  fetchPostPut: function(method, url, body) {
    return new Promise(res => {
      if (method == "put") {
        this.fetchPut(url, body).then((data) => res(data));
      } else {
        this.fetchPost(url, body).then((data) => res(data));
      }
    });
  },
}

export default UtilFuncs;