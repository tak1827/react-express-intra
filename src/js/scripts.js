(function() {
	M.AutoInit();// Initialize css flamework javascript
})();

// Close toast
function closeTost(elmnt) {
  const thisTost = elmnt.parentElement;
  M.Toast.getInstance(thisTost).dismiss();
  // thisTost.parentElement.removeChild(thisTost)
}


