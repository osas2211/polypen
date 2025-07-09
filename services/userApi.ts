import api from "./api.instance"

export interface OnboardPayload {
  name: string
  wallet_address: string
  role: "developer" | "poet" | "doctor"
  bio?: string
  website?: string
  avatar?: string
}

export interface Collaborator {
  name: string
  avatar: string
  wallet_address: string
}

export interface DocumentMeta {
  id: string
  title: string
  content: string
  category: string
  publishedAt: string
  readTime: string
  views: string
  tokenSymbol: string
  createdAt: string
  author: Collaborator
  collaborators: Collaborator[]
  featured: boolean
  gradient: string
  tags: string[]
}

export interface UserProfile {
  id: string
  name: string
  wallet_address: string
  role: string
  bio?: string
  website?: string
  avatar?: string
  createdAt: string
  documents: DocumentMeta[]
}

// POST /api/onboard
export async function onboardUser(
  payload: OnboardPayload
): Promise<{ streamId: string }> {
  const { data } = await api.post("/onboard", payload)
  return data
}

// GET /api/users
export async function retrieveAllUsers(): Promise<UserProfile[]> {
  const { data } = await api.get("/users")
  return data.users
}

// // GET /api/users/[id]
// export async function retrieveSingleUser(id: string): Promise<UserProfile> {
//   const { data } = await api.get(`/users/${id}`)
//   return data.user
// }

// GET /api/users/[wallet]
export async function retrieveSingleUser(
  wallet_address: string
): Promise<UserProfile> {
  const { data } = await api.get<{ user: UserProfile }>(
    `/users/${wallet_address}`
  )
  return data.user
}
