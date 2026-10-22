import { MatchesResponse } from "../types/types"

export const fetchMatches = async (url: string) => {
    const response = await fetch(url)

    if (!response.ok) throw new Error('error fetch')

    return response.json() as Promise<MatchesResponse>
}