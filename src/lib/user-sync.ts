import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "../db"

export async function syncClerkUser() {
  const clerkUser = await currentUser()
  if (!clerkUser) return null
  
  return await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
      image: clerkUser.imageUrl,
    },
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
      image: clerkUser.imageUrl,
    },
  })
}
