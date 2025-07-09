import { pinataWeb3 } from "@/utils/pinata_config"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useUploadJSONToIPFS = () => {
  async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
    const ipfs = await pinataWeb3.upload.json(jsonMetadata)
    return ipfs.IpfsHash
  }

  return useMutation({
    mutationFn: uploadJSONToIPFS,
    onSuccess(data) {},
    onError: () => {
      toast.error("Failed to upload JSON")
    },
  })
}
