(function() {
	// M.AutoInit();// Initialize css flamework javascript
	// M.Sidenav.init(document.querySelectorAll('.sidenav'));
  // M.Collapsible.init(document.querySelectorAll('.collapsible'));
  M.FormSelect.init(document.querySelectorAll('select'));
  // M.Dropdown.init(document.querySelectorAll('#area-news .dropdown-trigger'));
  // M.Modal.init(document.querySelectorAll('.modal'));
  // M.Datepicker.init(document.querySelectorAll('.datepicker'));
  // M.Timepicker.init(document.querySelectorAll('.timepicker'));
	// M.Modal.init(elem, {
 //      'onOpenEnd' : function() {
 //        alert("aaaa")
 //      }
 //    });
})();

// Close toast
function closeTost(elmnt) {
  const thisTost = elmnt.parentElement;
  M.Toast.getInstance(thisTost).dismiss();
  // thisTost.parentElement.removeChild(thisTost)
}


