const UtilFunc = {
  createToastHtml: function(msg, type) {
    const elm = '<span onclick="closeTost(this)" class="'+ type +'">'+ msg +'</span>';
    return elm;
  }
  // init: function() {
  //   M.Sidenav.init(document.querySelectorAll('.sidenav'));
  //   // M.Collapsible.init(document.querySelectorAll('.collapsible'));
  //   M.FormSelect.init(document.querySelectorAll('select'));
  //   M.Modal.init(document.querySelectorAll('.modal'));
  //   M.Datepicker.init(document.querySelectorAll('.datepicker'));
  //   M.Timepicker.init(document.querySelectorAll('.timepicker'));
  // },
  // closeTost: function(elmnt) {
  //   const thisTost = elmnt.parentElement;
  //   M.Toast.getInstance(thisTost).dismiss();
  //   // thisTost.parentElement.removeChild(thisTost)
  // },
}

export default UtilFunc;