type configType = {
  Version: string;
  Name: string;
  DestinationType: string;
  RequestMethod: string;
  RequestURL: string;
  Body: string;
  Arguments?: Record<string, any>;
  Headers?: Record<string, any>;
  FileFormName: string;
  URL: string;
  DeletionURL: string;
  ErrorMessage: string;
};

const configs: Record<string, configType> = {
  sharex: {
    Version: '15.0.0',
    Name: 'MeteorUploader',
    DestinationType: 'ImageUploader, FileUploader',
    RequestMethod: 'POST',
    RequestURL: '{{domain}}/api/upload',
    Headers: {
      token: 'upload_{{token}}',
    },
    Body: 'MultipartFormData',
    FileFormName: 'file',
    URL: '{json:url}',
    DeletionURL: '{json:deletionUrl}',
    ErrorMessage: '{json:displayMessage}',
  },
  sharenix: {
    Version: '15.0.0',
    Name: 'MeteorUploader',
    DestinationType: 'ImageUploader, FileUploader',
    RequestMethod: 'POST',
    RequestURL: '{{domain}}/api/upload',
    Headers: {
      token: 'upload_{{token}}',
    },
    Body: 'MultipartFormData',
    FileFormName: 'file',
    URL: '{json:url}',
    DeletionURL: '{json:deletionUrl}',
    ErrorMessage: '{json:displayMessage}',
  },
  flameshot: {
    Version: '15.0.0',
    Name: 'MeteorUploader',
    DestinationType: 'ImageUploader, FileUploader',
    RequestMethod: 'POST',
    RequestURL: '{{domain}}/api/upload',
    Headers: {
      token: 'upload_{{token}}',
    },
    Body: 'MultipartFormData',
    FileFormName: 'file',
    URL: '{json:url}',
    DeletionURL: '{json:deletionUrl}',
    ErrorMessage: '{json:displayMessage}',
  },
  magiccap: {
    Version: '15.0.0',
    Name: 'MeteorUploader',
    DestinationType: 'ImageUploader, FileUploader',
    RequestMethod: 'POST',
    RequestURL: '{{domain}}/api/upload',
    Headers: {
      token: 'upload_{{token}}',
    },
    Body: 'MultipartFormData',
    FileFormName: 'file',
    URL: '{json:url}',
    DeletionURL: '{json:deletionUrl}',
    ErrorMessage: '{json:displayMessage}',
  },
};

export default function getConfig(
  name: string,
  replace?: Array<[string, string]>,
): Record<string, any> {
  if (configs[name] === undefined) {
    throw new Error(`Config ${name} not found`);
  }

  const currentConfig = configs[name];
  console.log(currentConfig);
  // Handle Replace
  let configStr = JSON.stringify(currentConfig);
  if (replace) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < replace.length; i++) {
      const [key, value] = replace[i];

      configStr = configStr.replace(key, value);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(configStr);
}
