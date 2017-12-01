// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
    production: false,
    api_url: 'http://localhost:8081/api/',
    adal: {
        tenant: 'contosoair2.onmicrosoft.com',
        clientId: '510d95e3-94b8-43ef-9219-1f02698b2d64',
        extraQueryParameter: 'p=B2C_1_WebSignUpInPolicy&scope=openid'
    }
};