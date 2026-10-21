#!/usr/bin/env node
/**
 * Regenerates src/data/github.json from the GitHub API.
 *
 *   node scripts/fetch-github.mjs            # uses $GITHUB_TOKEN or `gh auth token`
 *   npm run fetch:github
 *
 * The site also refreshes profile + repo data live in the browser, but the
 * contribution graph is baked in here because GitHub only serves it over
 * GraphQL, which needs a token we do not want to ship to the browser.
 */
import { execFileSync } from 'node:child_process'
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../src/data/github.json')

const LOGIN = process.env.GITHUB_LOGIN || 'himanshu0072510'

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim()
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN.trim()
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim()
  } catch {
    return null
  }
}

const token = getToken()
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'portfolio-fetch-script',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
}

async function getJSON(url, extraHeaders = {}) {
  const res = await fetch(url, { headers: { ...headers, ...extraHeaders } })
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} for ${url}`)
  }
  return res.json()
}

/** Public repos, forks excluded, newest first. */
async function fetchRepos() {
  const all = await getJSON(
    `https://api.github.com/users/${LOGIN}/repos?per_page=100&type=owner&sort=updated`,
  )
  return all
    .filter((r) => !r.fork)
    .map((r) => ({
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      homepage: r.homepage || null,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      watchers_count: r.watchers_count,
      open_issues_count: r.open_issues_count,
      topics: r.topics ?? [],
      size: r.size,
      created_at: r.created_at,
      updated_at: r.updated_at,
      pushed_at: r.pushed_at,
      license: r.license?.spdx_id ?? null,
    }))
}

/** Contribution calendar for the last year — GraphQL only, needs a token. */
async function fetchContributions() {
  if (!token) {
    console.warn('! No token found — skipping contribution calendar.')
    return { total: 0, weeks: [] }
  }
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays { date contributionCount color contributionLevel }
            }
          }
        }
      }
    }`
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login: LOGIN } }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(`GraphQL: ${JSON.stringify(json.errors)}`)
  const cal = json.data.user.contributionsCollection.contributionCalendar
  return {
    total: cal.totalContributions,
    weeks: cal.weeks.map((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        color: d.color,
        level: d.contributionLevel,
      })),
    ),
  }
}

async function main() {
  console.log(`Fetching GitHub data for ${LOGIN}...`)

  const profile = await getJSON(`https://api.github.com/users/${LOGIN}`)
  const repos = await fetchRepos()
  const contributions = await fetchContributions()

  const languages = {}
  for (const repo of repos) {
    if (!repo.language) continue
    languages[repo.language] = (languages[repo.language] || 0) + 1
  }

  const payload = {
    fetchedAt: new Date().toISOString(),
    profile: {
      login: profile.login,
      name: profile.name,
      avatar_url: profile.avatar_url,
      html_url: profile.html_url,
      bio: profile.bio,
      company: profile.company,
      location: profile.location,
      blog: profile.blog,
      twitter_username: profile.twitter_username,
      public_repos: profile.public_repos,
      total_private_repos: profile.total_private_repos ?? 0,
      followers: profile.followers,
      following: profile.following,
      created_at: profile.created_at,
    },
    repos,
    languages,
    contributions,
  }

  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`)

  console.log(`✓ ${repos.length} repos, ${contributions.weeks.length} weeks of activity`)
  console.log(`✓ written to ${OUT}`)
}

main().catch((err) => {
  console.error(`✗ ${err.message}`)
  process.exit(1)
})
