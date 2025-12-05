// Copyright (c) 2025, Juel Batteries PTY(LTD) and contributors
// For license information, please see license.txt

// Client script settings : -
// Doctype = Work Order
// Apply to = Form
// Status = Disabled
//
// 1. Remind user that an Alternative Item is available for this WO
//
frappe.ui.form.on('Work Order', {
    refresh: function(frm) {                                                    // code for form-refresh-trigger
        if (frm.doc.status === 0) {                                             // if doc not submitted
            check_alternative_items(frm);
        }
    }
//    before_save: function(frm) {
//        check_alternative_items(frm);
//    }
});

function check_alternative_items(frm) {
    let items_with_alternatives = [];
    let promises = [];
    frm.doc.required_items.forEach(item => {                                    // iterate over required_items table
        let promise = new Promise((resolve, reject) => {
            frappe.call({
                method: "frappe.client.get_list",                               // use frappe get_list function
                args: {
                    doctype: "Item Alternative",                                // use Item Alternative doctype
                    filters: {
                        "item_code": item.item_code                             // criteria for search
                    },
                    fields: ["alternative_item_code"]                           // return field required
                },
                callback: function(response) {
                    if (response.message && response.message.length > 0) {
                        items_with_alternatives.push(item.item_code);
                    }
                    resolve();
                },
                error: function(err) {
                    reject(err);
                }
            });
        });

        promises.push(promise);
    });

    Promise.all(promises)
        .then(() => {
            if (items_with_alternatives.length > 0) {                           // If alternative items, prompt user
                let message = `The following items have alternatives:\n${items_with_alternatives.join(", ")}`;
                frappe.show_alert({
                    message: message,
                    indicator: 'orange'
                }, 10);
            }
        })
        .catch(error => {
            console.error("Error checking for alternative items:", error);
        });
}
