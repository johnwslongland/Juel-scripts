# Juel-Scripts

Repo to store scripts used on ERPNext for Juel Batteries

This repo contains files ( js, py ) that are loaded client-side , for additional functionality on certain doctypes.

There is a parent folder for each server and each server contains folders for the doctypes that has client scripts. These sub-folders are named according to the aplicable doctype ( e.g. Purchase Order, Production Plan etc).

Most doctypes only has a js-file and this is then placed in the applicable sub-folder under the server parent-folder. There can be more than one js-file because there can be a FORM-js and LIST-js file per doctype. This is normally differentiated by the name of the js-file. Also, the js-definition inside the file will determine this.

IMPORTNT NOTICE: All these files are backed-up as part of the database and as such , it should never be required to "load" these files by hand.

If however, it should be required to load any if these files by hand, please follow the following procedure :-

    Log in to your Prod Server
    navigate to the "Client Script" doctype.
    Create a new Client Script
    Copy the code contents from the file in this repo, to the "Script" field in the new Client Script.
    Assign a name to your new client script, typically the name of the file in this repo
    Assign the settings of the new client script file, as indicated in the comments in the file that is in this repo.
    Save new client script file.

If the file is a server-script file:-

    Log in to your Prod Server
    Navigate to the "Server Script" doctype
    Create a new Server Script
    Copy the code contents from the file in this repo, to the "Script" field in the new Server Script.
    Assign a name to your new client script, typically the name of the file in this repo
    Assign the settings of the new server script file, as indicated in the comments in the file that is in this repo.
    Save new server script file.
