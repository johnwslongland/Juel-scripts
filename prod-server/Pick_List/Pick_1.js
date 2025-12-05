// Copyright (c) 2025, Juel Batteries PTY(LTD) and contributors
// For license information, please see license.txt

// Client script settings : -
// Doctype = Pick List
// Apply to = Form
// Status = Enabled
//
// 1. Updates first_response_time field ; Core code does not - bug
// 2. Check if new code has a fix
//
frappe.ui.form.on('Pick List', {
    refresh: function(frm) {
        frm.add_custom_button(__('Update Bin Locations'), function() {
            
            frm.doc.locations.forEach(function (templateRow) {
                // Fetch item locaion for item cod ein row
                try {
                    
                    frappe.call({
                        method: 'frappe.client.get_value',                      // Fetch item locaion for item cod ein row : use frappe get_value
                        args: {
                            doctype: 'Item',                                    // from doctype Item
                            filters: {
                                item_code: templateRow.item_code                // search criteria
                            },
                            fieldname: ['custom_item_location']
                        },
                        callback: function(response) {
                            // Process data
                            if (response.message) {
                                if (response.message.custom_item_location) {
                                    templateRow.custom_item_location = response.message.custom_item_location;
                                    frm.fields_dict['locations'].grid.refresh();            // Update locations table
                                    frappe.show_alert("Item locations fetched");
                                } else {
                                    frappe.msgprint("No location info found for an item");
                                }
                            }
                        }
                    });                    
                    
                } catch (error) {
                    console.error('Error during Pick List Item population:', error);
                }
            });
        });
    }
});