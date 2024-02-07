import * as core from '@actions/core'
import {
  MSALClientCredentialsAuthProvider,
  PolicyUpload,
  ILogger
} from 'aadb2c-core-modules-js'

class Settings {
  policyFolder = ''
  tenant = ''
  clientId = ''
  clientSecret = ''
  clientCertificateThumbprint = ''
  clientCertificateKey = ''
  clientCertificatePass = ''
  verbose = false
}

class CoreLogger implements ILogger {
  verbose: boolean

  constructor(verbose: boolean) {
    this.verbose = verbose
  }

  logDebug(message: string): void {
    if (this.verbose) {
      core.debug(message)
    }
  }

  logInfo(message: string): void {
    core.info(message)
  }

  logWarn(message: string): void {
    core.warning(message)
  }

  logError(message: string): void {
    core.error(message)
  }

  startGroup(title: string): void {
    core.startGroup(title)
  }

  endGroup(): void {
    core.endGroup()
  }
}

async function run(): Promise<void> {
  const settings: Settings = new Settings()

  try {
    settings.policyFolder = core.getInput('policyFolder')
    settings.tenant = core.getInput('tenant')
    settings.clientId = core.getInput('clientId')
    settings.clientSecret = core.getInput('clientSecret')
    settings.clientCertificateThumbprint = core.getInput(
      'clientCertificateThumbprint'
    )
    settings.clientCertificateKey = core.getInput('clientCertificateKey')
    settings.clientCertificatePass = core.getInput('clientCertificatePass')
    settings.verbose = core.getInput('verbose') === 'true'

    core.info('Upload all custom policies GitHub Action V0.0 started.')

    let failed = false

    if (settings.policyFolder === '') {
      core.setFailed("The 'policyFolder' parameter is missing.")
      failed = true
    }

    if (settings.tenant === '') {
      core.setFailed("The 'tenant' parameter is missing.")
      failed = true
    }

    if (settings.clientId === '') {
      core.setFailed("The 'clientId' parameter is missing.")
      failed = true
    }

    if (
      !(
        (settings.clientCertificateThumbprint === '' &&
          settings.clientCertificatePass === '' &&
          settings.clientCertificateKey === '') ||
        (settings.clientCertificateThumbprint !== '' &&
          settings.clientCertificatePass !== '' &&
          settings.clientCertificateKey !== '')
      )
    ) {
      core.setFailed(
        'No matching parameter set for clientCertificateThumbprint, clientCertificateKey and clientCertificatePass was supplied.'
      )
      failed = true
    }

    if (settings.verbose) {
      core.info(JSON.stringify(settings))
    }

    if (failed) {
      return
    }

    const logger = new CoreLogger(settings.verbose)

    const authProvider = new MSALClientCredentialsAuthProvider(
      settings.tenant,
      settings.clientId,
      logger
    )

    if (settings.clientSecret !== '') {
      core.info('Initializing authentication provider with client secret.')
      authProvider.initializeWithClientSecret(settings.clientSecret)
    } else if (
      settings.clientCertificateThumbprint !== '' &&
      settings.clientCertificatePass !== '' &&
      settings.clientCertificateKey !== ''
    ) {
      core.info('Initializing authentication provider with client certificate.')
      authProvider.initializeWithClientCertificate(
        settings.clientCertificateThumbprint,
        settings.clientCertificateKey,
        settings.clientCertificatePass
      )
    } else {
      try {
        core.info(
          'No clientSecret or clientCertificate supplied, trying to obtain id_token for workload federation...'
        )
        const clientAssertion = await core.getIDToken()
        authProvider.initializeWithClientAssertion(clientAssertion)
      } catch (error) {
        core.setFailed(
          `Unable to obtain the id_token, did you include "permissions: id-token: write" in your job?`
        )
        throw error
      }
    }
    PolicyUpload(settings.policyFolder, authProvider, logger)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    core.setFailed(error.message)
  }
}

run()
