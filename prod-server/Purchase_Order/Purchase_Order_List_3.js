// Copyright (c) 2025, Juel Batteries PTY(LTD) and contributors
// For license information, please see license.txt

// Client script settings : -
// Doctype = Purchase Order
// Apply to = List
// Status = Enabled
//
// 1. Displayes payment status for po
// 2. View ToDo list related to this PO
// 3. Updates combined WF-Status indication
// 
frappe.listview_settings['Purchase Order'] = {
    onload: function(listview) {                                                        // code linked to the onload-form-trigger
        $(".list-row-col span:contains('Status')").each(function() {
          $(this).text("WFlow/Status");                                                 // New column label
        });
        
        listview.page.add_action_item(__('Check Payment Status'), function() {          // add option to ACTIONS-dropdown
            let selected_items = listview.get_checked_items();
            if (selected_items.length === 1) {
                let purchase_order = selected_items[0].name;
                
                frappe.call({
                    method: "get_payment_status",                                       // call client-side server script to fetch data
                    args: {
                        purchase_order: purchase_order
                    },
                    callback: function(r) {                                             // call back with result from server script
                        debugger;
                        if (r.status) {
                            debugger;
                            frappe.show_alert({                                         // Frappe pop-up bottom-right to display information
                                message: `Payment Status: ${r.status[0].status}`,
                                indicator: r.status[0].indicator
                            });
                        } else {
                            frappe.show_alert({
                                message: "No payment information found.",
                                indicator: "red"
                            });
                        }
                    }
                });
            } else {
                frappe.show_alert({                                                     // User prompt if more than one PO was selected
                    message: "Please select only one Purchase Order.",
                    indicator: "orange"
                });
            }
        });       
        
        listview.page.add_action_item(__('View ToDo'), function () {                    // add option to ACTIONS-dropdown
            let selected = listview.get_checked_items();
            if (selected.length !== 1) {
                frappe.msgprint(__('Please select only one Purchase Order.'));
                return;
            }

            let material_request_name = selected[0].name;                               // name of selected MR
            let current_user = frappe.session.user;                                     // currently logged in user
            frappe.show_alert(material_request_name);
            frappe.set_route('List', 'ToDo', {
                'reference_name': material_request_name,                                // citeria for displayed list information
                'allocated_to': current_user 
            });
        });        
        
    },    
    add_fields: ['status', 'workflow_state', 'name'],
    has_indicator_for_draft: true,
    has_indicator_for_cancelled: true,
    get_indicator: function(doc) {                                                      // Update indicator fields with status information
//        let combined_state = `${doc.workflow_state} / ${doc.status}`;
        let combined_state = '';
        let wf_state = '';

        if (doc.workflow_state == "Not Saved") {
            wf_state = "NotS";
        }
        if (doc.workflow_state == "Draft") {
            wf_state = "Drft";
        }
        if (doc.workflow_state == "Approved") {
            wf_state = "Appd";
        }
        if (doc.workflow_state == "Approval Pending") {
            wf_state = "App Pend";
        }   
        if (doc.workflow_state == "Cancelled") {
            wf_state = "Cancl";
        }         
        if (doc.workflow_state == "Rejected") {
            wf_state = "Rejd";
        }         
        let indicator_color = "grey";  // Default color

        if (doc.status == "Draft") {
            combined_state = wf_state +'/Draft';
            indicator_color = "orange";
        }
        if (doc.status == "On Hold") {
            combined_state = wf_state +'/Hld';
            indicator_color = "orange";
        }      
        if (doc.status == "To Receive and Bill") {
            combined_state = wf_state +'/Rx-Bill';
            indicator_color = "blue";
        }     
        if (doc.status == "To Bill") {
            combined_state = wf_state +'/Bill';
            indicator_color = "blue";
        }
        if (doc.status == "To Receive") {
            combined_state = wf_state +'/Rx';
            indicator_color = "blue";
        }        
        if (doc.status == "Cancelled") {
            combined_state = wf_state +'/Cancl';
            indicator_color = "red";
        }  
        if (doc.status == "Closed") {
            combined_state = wf_state +'/Closd';
            indicator_color = "red";
        }
        if (doc.status == "Delivered") {
            combined_state = wf_state +'/Delivd';
            indicator_color = "green";
        }  
        if (doc.status == "Completed") {
            combined_state = wf_state +'/Compld';
            indicator_color = "green";
        }        
        return [combined_state, indicator_color];
    },
    formatters : {
        wf_status(val) {
            return val ? 'Yes' : 'No';
        }
    }
};