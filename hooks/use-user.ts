// src/hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  onboardUser,
  retrieveSingleUser,
  retrieveAllUsers,
  OnboardPayload,
  UserProfile,
} from "@/services/userApi"

/** List all users */
export function useUsers() {
  return useQuery<UserProfile[]>({
    queryFn: retrieveAllUsers,
    queryKey: ["all-users"],
    staleTime: 1000 * 60,
  })
}

/** Get a single user by ID */
export function useUser(wallet_address: string | undefined) {
  return useQuery<UserProfile>({
    queryFn: () => retrieveSingleUser(wallet_address!),
    queryKey: [`user-${wallet_address}`],
    enabled: Boolean(wallet_address),
  })
}

/** Onboard (create) a new user */
export function useOnboardUser() {
  const qc = useQueryClient()
  return useMutation<{ streamId: string }, Error, OnboardPayload>({
    mutationFn: (payload: OnboardPayload) =>
      onboardUser({
        ...payload,
        wallet_address: payload?.wallet_address?.toLowerCase(),
      }),
    onSuccess: () => {
      // Refresh the users list after a successful onboard
      qc.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
