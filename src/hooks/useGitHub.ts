import { useEffect, useState } from 'react'
import baked from '../data/github.json'

export interface GhRepo {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  topics: string[]
  size: number
  created_at: string
  updated_at: string
  pushed_at: string
  license: string | null
}

export interface GhProfile {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  company: string | null
  location: string | null
  blog: string
  twitter_username: string | null
  public_repos: number
  total_private_repos: number
  followers: number
  following: number
  created_at: string
}

export interface ContributionDay {
  date: string
  count: number
  color: string
  level: string
}

type Status = 'loading' | 'live' | 'cached'

const API = 'https://api.github.com'

function headers(): HeadersInit {
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined
  const base: HeadersInit = { Accept: 'application/vnd.github+json' }
  return token ? { ...base, Authorization: `Bearer ${token}` } : base
}

/**
 * Serves the baked GitHub snapshot immediately, then replaces it with live
 * API data if the browser can reach GitHub. The site therefore never renders
 * an empty shell, even if the API is blocked or rate-limited.
 */
export function useGitHub() {
  const [profile, setProfile] = useState<GhProfile>(baked.profile as GhProfile)
  const [repos, setRepos] = useState<GhRepo[]>(baked.repos as GhRepo[])
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const [pRes, rRes] = await Promise.all([
          fetch(`${API}/users/${baked.profile.login}`, {
            headers: headers(),
            signal: controller.signal,
          }),
          fetch(`${API}/users/${baked.profile.login}/repos?per_page=100&sort=updated`, {
            headers: headers(),
            signal: controller.signal,
          }),
        ])
        if (!pRes.ok || !rRes.ok) throw new Error('GitHub API unavailable')

        const [p, r] = await Promise.all([pRes.json(), rRes.json()])
        if (!p?.login || !Array.isArray(r)) throw new Error('Unexpected API shape')

        setProfile({ ...baked.profile, ...p, blog: p.blog || '' })
        setRepos(
          (r as Record<string, unknown>[])
            .filter((repo) => !repo.fork)
            .map((repo) => ({
              name: repo.name as string,
              description: (repo.description as string) ?? null,
              html_url: repo.html_url as string,
              homepage: (repo.homepage as string) || null,
              language: (repo.language as string) ?? null,
              stargazers_count: repo.stargazers_count as number,
              forks_count: repo.forks_count as number,
              watchers_count: (repo.watchers_count as number) ?? 0,
              open_issues_count: (repo.open_issues_count as number) ?? 0,
              topics: (repo.topics as string[]) ?? [],
              size: (repo.size as number) ?? 0,
              created_at: repo.created_at as string,
              updated_at: repo.updated_at as string,
              pushed_at: repo.pushed_at as string,
              license: ((repo.license as { spdx_id?: string } | null)?.spdx_id as string) ?? null,
            })),
        )
        setStatus('live')
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return
        setStatus('cached')
      }
    }

    load()
    return () => controller.abort()
  }, [])

  return { profile, repos, status, contributions: baked.contributions, fetchedAt: baked.fetchedAt }
}

/** Language -> hex colour, for the language dots. */
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Swift: '#F05138',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  'C++': '#f34b7d',
  C: '#555555',
  Java: '#b07219',
  Dart: '#00B4AB',
  Kotlin: '#A97BFF',
  Lua: '#000080',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Zig: '#ec915c',
}

export function languageColor(language: string | null): string {
  if (!language) return '#8b8b98'
  return LANGUAGE_COLORS[language] ?? '#8b8b98'
}
