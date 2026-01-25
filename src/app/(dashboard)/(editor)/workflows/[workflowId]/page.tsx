
import { requireAuth } from "@/lib/auth-utils"


const Page = async() => {
  await requireAuth()
  return (
    <div> Workflow Id  </div>
  )
}

export default Page
