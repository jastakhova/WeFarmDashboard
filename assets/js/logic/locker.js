function addLockerLogic(addElementLogic) {
	// adds a click listener to the form locker button
	Array.from(document.getElementsByClassName("locker")).map(function(x, i, ar) {
			ar[i].addEventListener('click', e => {
				e.preventDefault();
				// changes appearance of the locker button between locked and unlocked state
				iClassName = ar[i].getElementsByTagName("i")[0].className;
				if (iClassName.indexOf("fa-lock") >= 0) {
					newClassName = iClassName.replace("fa-lock", "fa-unlock");
					ar[i].className = ar[i].className.replace("btn-primary", "btn-success");
				} else {
					newClassName = iClassName.replace("fa-unlock", "fa-lock");
					ar[i].className = ar[i].className.replace("btn-success", "btn-primary");
				}
				ar[i].getElementsByTagName("i")[0].className = newClassName;
				
				// activates or deactivates switches
				Array.from(ar[i].parentElement.parentElement.parentElement.getElementsByClassName("switch")).map(function(xx, ii, arr) {
					iClassName = arr[ii].className;
					if (iClassName.indexOf("deactivate") >= 0) {
						arr[ii].className = iClassName.replace("deactivate", "");
					} else {
						arr[ii].className = iClassName.replace("switch", "switch deactivate");
					}
				});
				
				// activates or deactivates inputs
				Array.from(ar[i].parentElement.parentElement.parentElement.getElementsByTagName("input")).map(function(xx, ii, arr) {
					arr[ii].disabled = !arr[ii].disabled;
				});
				
				addElementLogic(ar[i]);
		 });
	});
}