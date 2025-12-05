// Copyright (c) 2025, Juel Batteries PTY(LTD) and contributors
// For license information, please see license.txt

// Client script settings : -
// Doctype = Item
// Apply to = Form
// Status = Disabled
//
// 1. Manage the allocation of a item_location for a new item
// 2. User input : Warehouse Code ; Rack Code
//
frappe.ui.form.on('Item', {
    refresh: function(frm) {
        // Manage calculation of rac_ID
        if (frm.doc.custom_warehouse_code && !frm.doc.is_fixed_asset) {
            if (frm.doc.custom_rack_code) {
                frm.set_value('custom_rack_id', frm.doc.custom_warehouse_code + frm.doc.custom_rack_code);    // Set Rack-ID
            }
        }   
    },
    custom_warehouse_code: function(frm) {
        frm.trigger("refresh");
    },
    custom_rack_code: function(frm) {
        frm.trigger("refresh");
    },
    before_save: function(frm) {
        if ((frm.doc.is_fixed_asset === 0) && (frm.doc.is_stock_item === 1)  ) {   // stock item ; not fixed asset
            if (!frm.doc.custom_rack_id){
                frappe.msgprint("Please select Rack ID");
            } else {
                var rack_id = frm.doc.custom_rack_id;
                allocateLocationCode(frm,rack_id);
            }        
        } else {
            frm.set_value('custom_item_location', "");
            frm.refresh_field('custom_item_location');
            frm.set_value('custom_rack_id', "");
            frm.refresh_field('custom_rack_id');            
        }
    }
});


function allocateLocationCode(frm,rackId) {
    // fetch the last allocated number for the given rack ID and increment
//    debugger;
    frappe.call({
        method: 'get_last_sequence_number',       // This funciton call must by in server-script API
        args: {
            rack_id: rackId
        },
        callback: function(r) {
            if (r.lastNumber !== undefined) {
                // Increment last allocated number to generate the new location code
                var lastNumber = r.lastNumber;
                var newNumber = parseInt(lastNumber) + 1;
                var newLocationCode = rackId + '-' + newNumber.toString().padStart(5, '0');
                
                // Update location code in the Item form
                cur_frm.set_value('custom_item_location', newLocationCode);
                
                frappe.msgprint(__('Location code allocated: ' + newLocationCode));
            } else {
                frappe.msgprint(__('Error: Unable to fetch last location number.'));
            }
        }
    });
}
