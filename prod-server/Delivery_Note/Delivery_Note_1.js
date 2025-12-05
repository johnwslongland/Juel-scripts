// Copyright (c) 2025, Juel Batteries PTY(LTD) and contributors
// For license information, please see license.txt

// Client script settings : -
// Doctype = Delivery Note
// Apply to = Form
// Status = Enabled
//
// 1. Adds functionality to print QR code of serial No
//
frappe.ui.form.on('Delivery Note', {
    refresh: function(frm) {                                                        // code for form-refresh-trigger
        if (!frm.doc.__islocal) {                                                   // if doc has been saved

            frm.add_custom_button('Print QR Serial Numbers', function() {           // Add button
                var qr_codes = [];
                
                var packedItems = frm.doc.packed_items || [];                       // get items in packed_items list
                packedItems.forEach(function(item, index) {                         // iterate over packed_items list
                    if (item.serial_no) {
                        var serialNumbers = item.serial_no.split(',').map(s => s.trim());   // create cleaned-up array of serial nrs
                        serialNumbers.forEach(function(serial, serialIndex) {
                            var qrData = `Item: ${item.item_code}\nSerial No: ${serial}\nRow: ${index + 1}\nQty: ${item.qty}`;
                            qr_codes.push({"Qr code": qrData});
                        });
                    }
                });
                if (qr_codes.length > 0) {
                    var qrCodesJson = JSON.stringify(qr_codes);
                    generatePdfWithQRCodes(qrCodesJson);                            // Call function to create QR-code              
                } else {
                    frappe.msgprint('No serial numbers found in the Packed Items table.');
                }
            });
        }
    }
});

function generatePdfWithQRCodes(qrCodesJson) {

    var qrCodes = JSON.parse(qrCodesJson);                                              // Parse JSON string to get array of QR codes

    var htmlContent = '<html><head><title>QR Codes</title></head><body>';               // Create new HTML document

    htmlContent += '<style>.qr-code { margin-bottom: 20px; }</style>';                  // Add styles to format the QR codes

    qrCodes.forEach(function(qrCode) {                                                  // Loop through each QR code and generate HTML for QR code and text
        htmlContent += '<div class="qr-code">';
        htmlContent += '<img src="' + generateQRCodeImage(qrCode["Qr code"]) + '" alt="QR Code">';
        htmlContent += '<p>' + qrCode["Qr code"].replace(/\n/g, '<br>') + '</p>';
        htmlContent += '</div>';
    });

    htmlContent += '</body></html>';                                                    // Close HTML document

    var newWindow = window.open();                                                      // Create new window to display the HTML
    newWindow.document.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();

    newWindow.print();
}

function generateQRCodeImage(qrCodeData) {                                              // Use online QR-code generator
    var qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(qrCodeData);
    return qrCodeUrl;
}