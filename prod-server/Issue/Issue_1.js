// Copyright (c) 2025, Juel Batteries PTY(LTD) and contributors
// For license information, please see license.txt

// Client script settings : -
// Doctype = Issue
// Apply to = Form
// Status = Enabled
//
// 1. Updates first_response_time field ; Core code does not - bug
// 2. Check if new code has a fix
//
frappe.ui.form.on('Issue', {
	refresh(frm) {
		// your code here
	},
		first_responded_on: function(frm) {
	    frappe.show_alert("Calculate time", 5);
        var openingDate = frm.doc.opening_date;
    
        var openingDateTime = new Date(openingDate);                                            // Convert opening date to Date object
    
        var openingTime = frm.doc.opening_time;                                                 // Convert opening time to milliseconds
        var openingTimeParts = openingTime.split(':');
        var openingTimeMilliseconds = (+openingTimeParts[0] * 60 * 60 * 1000) + (+openingTimeParts[1] * 60 * 1000) + (+openingTimeParts[2] * 1000);
        
        var firstRespondedOn = frm.doc.first_responded_on;                                      // Get the selected first_responded_on date-time
        
        var respondedDate = frappe.datetime.get_datetime_as_string(firstRespondedOn).split(' ')[0]; // Split first_responded_on datetime into date and time components
        var respondedTime = frappe.datetime.get_datetime_as_string(firstRespondedOn).split(' ')[1];
        
        var respondedDateTime = new Date(respondedDate);                                        // Convert responded date to JavaScript Date object
        
        var respondedTimeParts = respondedTime.split(':');                                      // Convert responded time to milliseconds
        var respondedTimeMilliseconds = (+respondedTimeParts[0] * 60 * 60 * 1000) + (+respondedTimeParts[1] * 60 * 1000) + (+respondedTimeParts[2] * 1000);
        
        var timeDifferenceInMilliseconds = respondedDateTime - openingDateTime;                 // Calculate the time difference in milliseconds
    
    
        var finalTimeDifferenceInMilliseconds = timeDifferenceInMilliseconds - openingTimeMilliseconds + respondedTimeMilliseconds; // Calculate final time difference in milliseconds
        
        frm.set_value('first_response_time', finalTimeDifferenceInMilliseconds/1000);           // Set the first_response_time field
        frm.refresh_field('first_response_time');        
	}
});