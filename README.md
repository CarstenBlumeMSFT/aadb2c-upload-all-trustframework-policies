# GitHub Action to upload all Azure AD B2C custom policies

Use this GitHub Action to deploy all [Azure AD B2C custom policies](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview) from a folder and its subfolders into your Azure Active Directory B2C tenant using the [Microsoft Graph API](https://docs.microsoft.com/graph/api/resources/trustframeworkpolicy?view=graph-rest-beta). If the policies do not yet exist, they will be created. If the policies already exists, they will be replaced.

For more information on the general setup for this scenario, see [Deploy Azure AD B2C custom policy with GitHub actions](https://docs.microsoft.com/azure/active-directory-b2c/deploy-custom-policies-github-action).

This GitHub Action offers three different options for authenticating your Microsoft Graph application in your Azure AD B2C tenant:
- GitHub ID Token as Workload identity federation: Best available option, since it doesn't require you to maintain a secret in your repository.
- Client Certificate: Uses a certificate to authenticate towards your Azure AD B2C, should be preferred if Workload identity federation can't be used.
- Client Secret: Uses a symmetric secret to authenticate towards your Azure AD B2C.

## Usage with GitHub ID Token as Workload identity federation
This variant uses the [Workload identity federation](https://learn.microsoft.com/en-us/azure/active-directory/develop/workload-identity-federation) to build trust between your GitHub repository and the Azure AD B2C App registration.

The federated identity credential creates a trust relationship between an application and an external identity provider (IdP). You can then configure an external software workload to exchange a token from the external IdP for an access token from Microsoft identity platform. The external workload can access Azure AD protected resources without needing to manage secrets.

To use this way of authentication you need to setup the federated credentials for your App Registration in Azure AD B2C as described [here](https://learn.microsoft.com/en-us/azure/active-directory/develop/workload-identity-federation-create-trust?pivots=identity-wif-apps-methods-azp#github-actions).

**IMPORTANT: In your federated credentials of your App Registration set the "Audience" property to:```https://github.com/<your-org-name>```**
### Sample workflow to upload with GitHub ID Token

```yaml
on: push

env:
  clientId: 00000000-0000-0000-0000-000000000000
  tenant: my-tenant.onmicrosoft.com

jobs:
  build:
    runs-on: ubuntu-latest

    permissions:
      id-token: write
      contents: read

    steps:
    - uses: actions/checkout@v3

    - name: 'Upload all policies'
      uses: CarstenBlumeMSFT/aadb2c-upload-all-trustframework-policies@v0.0.1
      with:
        policyFolder: ./MyGeneratedPolicyFolder
        tenant: ${{ env.tenant }}
        clientId: ${{ env.clientId }}
        verbose: true
```

### Parameters for upload with GitHub ID Token
| Parameter | Description |
| :-------- | :---------- |
| policyFolder | The input folder for uploading the policies. The action will find all XML-files in the folder and its subfolders and automatically derive the order of uploading from the inheritance between the files. |
| tenant | The tenant id of your Azure AD B2C tenant either as an url "onmicrosoft.com" or as a GUID. |
| clientId | The client id of the Microsoft Graph application you registered in your Azure AD B2C tenant. |
| verbose *(optional)* | true / false - Indicates if the logging outbut should be verbose. *(default: false)* |

## Usage with Client Certificate
### Sample workflow to upload with Client Certificate

```yaml
on: push

env:
  clientId: 00000000-0000-0000-0000-000000000000
  tenant: my-tenant.onmicrosoft.com
  clientCertificateThumbprint: abc123def456ghi789abc123def456ghi789abc1

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: 'Upload all policies'
      uses: CarstenBlumeMSFT/aadb2c-upload-all-trustframework-policies@v0.0.1
      with:
        policyFolder: ./MyGeneratedPolicyFolder
        tenant: ${{ env.tenant }}
        clientId: ${{ env.clientId }}
        clientCertificateThumbprint: ${{ env.clientCertificateThumbprint }}
        clientCertificateKey: ${{ secrets.clientCertificateKey }}
        clientCertificatePass: ${{ secrets.clientCertificatePass }}
        verbose: true
```

### Parameters for upload with Client Certificate
| Parameter | Description |
| :-------- | :---------- |
| policyFolder | The input folder for uploading the policies. The action will find all XML-files in the folder and its subfolders and automatically derive the order of uploading from the inheritance between the files. |
| tenant | The tenant id of your Azure AD B2C tenant either as an url "onmicrosoft.com" or as a GUID. |
| clientId | The client id of the Microsoft Graph application you registered in your Azure AD B2C tenant. |
| clientCertificateThumbprint | The 40-digit thumbprint of the public certificate you uploaded as a client credential for your App Registration as described [here](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#option-1-upload-a-certificate).  |
| clientCertificateKey | Then encrypted private key of your certificate in PEM format (should look like: ```-----BEGIN ENCRYPTED PRIVATE KEY-----MIIFHDBOBgkqhki[...]-----END ENCRYPTED PRIVATE KEY-----```. This must start with "BEGIN ENCRYPTED PRIVATE KEY" and may not contain any Bag / Key Attributes before this.) |
| clientCertificatePass | The passphrase to decrypt your private key. |
| verbose *(optional)* | true / false - Indicates if the logging outbut should be verbose. *(default: false)* |

## Usage with Client Secret
### Sample workflow to upload with Client Secret

```yaml
on: push

env:
  clientId: 00000000-0000-0000-0000-000000000000
  tenant: my-tenant.onmicrosoft.com

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: 'Upload all policies'
      uses: CarstenBlumeMSFT/aadb2c-upload-all-trustframework-policies@v0.0.1
      with:
        policyFolder: ./MyGeneratedPolicyFolder
        tenant: ${{ env.tenant }}
        clientId: ${{ env.clientId }}
        clientSecret: ${{ secrets.clientSecret }}
        verbose: true
```

### Parameters for upload with Client Secret
| Parameter | Description |
| :-------- | :---------- |
| policyFolder | The input folder for uploading the policies. The action will find all XML-files in the folder and its subfolders and automatically derive the order of uploading from the inheritance between the files. |
| tenant | The tenant id of your Azure AD B2C tenant either as an url "onmicrosoft.com" or as a GUID. |
| clientId | The client id of the Microsoft Graph application you registered in your Azure AD B2C tenant. |
| clientSecret | The symmetric client secret you generated at your App Registration as described [here](https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-register-applications?tabs=app-reg-ga#create-a-client-secret). |
| verbose *(optional)* | true / false - Indicates if the logging outbut should be verbose. *(default: false)* |