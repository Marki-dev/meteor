type configType = {
    Version: string;
    Name: string;
    DestinationType: string;
    RequestMethod: string;
    RequestURL: string;
    Body: string;
    Arguments: Record<string, any>;
    FileFormName: string;
    URL: string;
    DeletionURL: string;
    ErrorMessage: string;
}

const configs: Record<string, configType> = {

    sharex: {
        "Version": "13.1.0",
        "Name": "MeteorUploader",
        "DestinationType": "ImageUploader, FileUploader",
        "RequestMethod": "POST",
        "RequestURL": "https://{{domain}}/api/upload",
        "Body": "MultipartFormData",
        "Arguments": {
            "token": "Bearer {{token}}"
        },
        "FileFormName": "file",
        "URL": "$json:url$",
        "DeletionURL": "$json:deletionUrl$",
        "ErrorMessage": "$json:displayMessage$"
    },
    flameshot: {
        "Version": "13.1.0",
        "Name": "MeteorUploader",
        "DestinationType": "ImageUploader, FileUploader",
        "RequestMethod": "POST",
        "RequestURL": "https://{{domain}}/api/upload",
        "Body": "MultipartFormData",
        "Arguments": {
            "token": "Bearer {{token}}"
        },
        "FileFormName": "file",
        "URL": "$json:url$",
        "DeletionURL": "$json:deletionUrl$",
        "ErrorMessage": "$json:displayMessage$"
    },
    magiccap: {
        "Version": "13.1.0",
        "Name": "MeteorUploader",
        "DestinationType": "ImageUploader, FileUploader",
        "RequestMethod": "POST",
        "RequestURL": "https://{{domain}}/api/upload",
        "Body": "MultipartFormData",
        "Arguments": {
            "token": "Bearer {{token}}"
        },
        "FileFormName": "file",
        "URL": "$json:url$",
        "DeletionURL": "$json:deletionUrl$",
        "ErrorMessage": "$json:displayMessage$"
    }
}




export default function getConfig(name: string, replace?: [string, string][]): Record<string, any> {

    if (configs[name] === undefined) {
        throw new Error(`Config ${name} not found`);
    }
    let currentConfig = configs[name];
    console.log(currentConfig);
    // Handle Replace
    let configStr = JSON.stringify(currentConfig);
    if (replace) {
        for (let i = 0; i < replace.length; i++) {
            const [key, value] = replace[i];

            configStr = configStr.replace(`{{${key}}}`, value);
        }
    }
    return JSON.parse(configStr);
}
