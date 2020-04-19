const spinner = require('ora')()
const exec = require('execa')
const chalk = require('chalk')
const RegClient = require('npm-registry-client')

const client = new RegClient({})

function npmLogin() {
  return new Promise((resolve, reject) => {
    spinner.start('npm login...')
    client.adduser(
      'https://npm.pkg.github.com',
      {
        auth: {
          username: process.env.NPM_USER,
          password: process.env.NPM_PASSWORD,
          email: process.env.NPM_EMAIL,
        },
      },
      (err, data) => {
        if (err) {
          spinner.fail(chalk.red('npm login error:'))
          reject(err)
          process.exit(0)
          return
        }
        spinner.succeed(chalk.green('npm login succeed!'))
        resolve()
      },
    )
  })
}

async function build() {
  await npmLogin()
  try {
    spinner.start('build start...')
    await exec('yarn', ['install', '--production', 'false'])
    await exec('yarn', ['build'])
    spinner.succeed(chalk.green('build succeed!'))
  } catch (error) {
    spinner.fail(chalk.red('build error:'))
    console.error(error)
    process.exit(0)
  }
}

build()
