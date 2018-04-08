(function() {
	// Initialize css flamework javascript
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.FormSelect.init(document.querySelectorAll('select'));
  M.Modal.init(document.querySelectorAll('.modal'));
  M.Datepicker.init(document.querySelectorAll('.datepicker'));
  // M.Timepicker.init(document.querySelectorAll('.timepicker'));
})();

// Close toast
function closeTost(elmnt) {
  const thisTost = elmnt.parentElement;
  M.Toast.getInstance(thisTost).dismiss();
  // thisTost.parentElement.removeChild(thisTost)
}
