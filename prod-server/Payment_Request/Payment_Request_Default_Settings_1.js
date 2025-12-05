// Copyright (c) 2025, Juel Batteries PTY(LTD) and contributors
// For license information, please see license.txt

// Client script settings : -
// Doctype = Payment Request
// Apply to = Form
// Status = Enabled
//
// 1. Sets certain defaults
//
frappe.ui.form.on('Payment Request', {
	refresh(frm) {                                                              // code for form-refresh-trigger
	    if (!frm.doc.mode_of_payment) {                                         // if mode_of_payment field empty
		    frm.set_value("mode_of_payment", "EFT");                            // Set default mode as EFT
		    frm.refresh_field("mode_of_payment");
	    }
	    if (!frm.doc.bank_account) {                                            // if bank_account field empty
		    frm.set_value("bank_account", "ABSA CHQ 4102852151 - ABSA");        // Set default bank account 
		    frm.refresh_field("bank_account");
	    }
	}
});