// Copyright (c) 2025, Juel Batteries PTY(LTD) and contributors
// For license information, please see license.txt

// Client script settings : -
// Doctype = Material Request
// Apply to = List
// Status = Enabled
//
// 1. View ToDO for MR
// 2. Update status indications for MR
//
frappe.listview_settings['Material Request'] = {
    onload: function(listview) {
        $(".list-row-col span:contains('Status')").each(function() {                    // Set new name for column
          $(this).text("WFlow/Status");
        });
        
        listview.page.add_action_item(__('View ToDo'), function () {                    // Add function to ACTIONS drop-down
            let selected = listview.get_checked_items();
            if (selected.length !== 1) {                                                // Only one selection allowed
                frappe.msgprint(__('Please select only one Material Request.'));
                return;
            }

            let material_request_name = selected[0].name;                               // process selection made by user
            let current_user = frappe.session.user; 
            frappe.show_alert(material_request_name);
            frappe.set_route('List', 'ToDo', {                                          // Set route to view ToDo
                'reference_name': material_request_name,
                'allocated_to': current_user 
            });
        });        
    },    
    add_fields: ['status', 'workflow_state', 'name'],
    has_indicator_for_draft: true,
    has_indicator_for_cancelled: true,
    get_indicator: function(doc) {                                                      // Update indicator settings for each doc
//        let combined_state = `${doc.workflow_state} / ${doc.status}`;
        let combined_state = '';
        let wf_state = '';

        if (doc.workflow_state == "Draft") {
            wf_state = "Drft";
        }
        if (doc.workflow_state == "Approved") {
            wf_state = "Appd";
        }
        if (doc.workflow_state.includes("Approval Pending")) {
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
        if (doc.status == "Pending") {
            combined_state = wf_state +'/Pend';
            indicator_color = "blue";
        }      
        if (doc.status == "Manufactured") {
            combined_state = wf_state +'/Manuf';
            indicator_color = "green";
        }        
        if (doc.status == "Cancelled") {
            combined_state = wf_state +'/Cancl';
            indicator_color = "red";
        }  
        if (doc.status == "Stopped") {
            combined_state = wf_state +'/Stpd';
            indicator_color = "red";
        }
        if (doc.status == "Received") {
            combined_state = wf_state +'/Rxd';
            indicator_color = "green";
        }  
        if (doc.status == "Submitted") {
            combined_state = wf_state +'/Subm';
            indicator_color = "blue";
        }        
        if (doc.status == "Ordered") {
            combined_state = wf_state +'/Ord';
            indicator_color = "blue";
        }        
        if (doc.status == "Partially Ordered") {
            combined_state = wf_state +'/ParOrd';
            indicator_color = "blue";
        }         

        return [combined_state, indicator_color];
    },
    formatters : {
        wf_status(val) {
            return val ? 'Yes' : 'No';
        }
    }
};