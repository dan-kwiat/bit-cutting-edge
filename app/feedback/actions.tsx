"use server"

import { FeedbackNew, insertFeedback } from "@/lib/db/feedback"

// import { revalidatePath } from "next/cache"
// import { redirect } from "next/navigation"

export async function create(
  formData: FormData
): Promise<{ type: "success" | "error"; message: string }> {
  try {
    // await createItem(formData.get("item"))
    // revalidatePath("/")
    console.log(formData)

    const feedback: FeedbackNew = {
      useful: formData.get("useful") === "yes",
      filters: formData.get("filters") === "yes",
      more_useful: formData.get("more_useful") as string,
      participant_name: formData.get("participant_name") as string,
      comments: formData.get("comments") as string,
    }
    console.log(feedback)

    await insertFeedback(feedback)

    // redirect(`/`)
    return { type: "success", message: "Feedback submitted!" }
  } catch (e) {
    console.error(e)
    return { type: "error", message: "Sorry, something went wrong" }
  }
}
