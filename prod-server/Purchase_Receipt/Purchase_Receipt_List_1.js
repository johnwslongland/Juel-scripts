// Copyright (c) 2025, Juel Batteries PTY(LTD) and contributors
// For license information, please see license.txt

// Client script settings : -
// Doctype = Purchase Receipt
// Apply to = List
// Status = enabled
//
// 1. Hide button to create new PRE
// 2. Show ToDO list
// 
frappe.listview_settings['Purchase Receipt'] = {
    onload: function(listview) {
        
        listview.page.add_action_item(__('View ToDo'), function () {                // add button on each row in list-view
            let selected = listview.get_checked_items();                            // fetch user selection
            if (selected.length !== 1) {
                frappe.msgprint(__('Please select only one Purchase Receipt.'));
                return;
            }

            let material_request_name = selected[0].name;                           // set criteria : mr name
            let current_user = frappe.session.user;                                 // set criteria : user
            frappe.show_alert(material_request_name);
            frappe.set_route('List', 'ToDo', {                                      // Set route to ToDO doctype
                'reference_name': material_request_name,
                'allocated_to': current_user 
            });
        });
        
    },
    refresh: function(listview) {                   // hide add-purchase-receipt button
        $('.btn-primary').hide();
    },
    get_indicator(doc) {                            // load default indicator colors
        return[__(doc.status), frappe.utils.guess_colour(doc.status), "status,=," + doc.status];
    }    

};