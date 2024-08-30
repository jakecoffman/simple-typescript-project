import * as core from '@actions/core'
import * as github from '@actions/github'

function run(): void {
    try {
        const inputs = {
            environment: core.getInput('environment', {required: true}),
            token: core.getInput('token', {required: true})
        }

        core.setOutput('hello', 'world')

        let unused = {
            ...inputs,
            repoName: github.context.repo.repo,
            repoOwner: github.context.repo.owner
        }

        console.log(unused)

    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

run()
