"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getWorkItemRepository } from "@/lib/workitems";
import { validateWorkItemInput, WorkItemFieldErrors } from "@/lib/workitems/validation";

export type ActionState = {
  errors?: WorkItemFieldErrors;
  values?: Record<string, string>;
  message?: string;
};

function isNextRouterError(e: unknown): boolean {
  if (typeof e === "object" && e !== null) {
    if ("message" in e) {
      const msg = (e as { message: unknown }).message;
      if (typeof msg === "string" && (msg === "NEXT_REDIRECT" || msg === "NEXT_NOT_FOUND")) {
        return true;
      }
    }
    if ("digest" in e) {
      const digest = String((e as { digest: unknown }).digest);
      if (digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND")) {
        return true;
      }
    }
  }
  return false;
}

export async function createWorkItem(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const result = validateWorkItemInput(formData);
  if (!result.ok) {
    return {
      errors: result.errors,
      values: result.values,
    };
  }

  try {
    const repo = getWorkItemRepository();
    const created = await repo.create(result.data);

    revalidatePath("/workitems");
    redirect(`/workitems/${created.key}`);
  } catch (error) {
    if (isNextRouterError(error)) {
      throw error;
    }
    return {
      errors: {},
      values: result.values,
      message: "An unexpected error occurred while creating the work item. Please try again.",
    };
  }
}

export async function updateWorkItem(
  keyOrPrevState: string | ActionState,
  prevStateOrFormData: ActionState | FormData,
  maybeFormData?: FormData
): Promise<ActionState> {
  let key: string;
  let formData: FormData;

  if (typeof keyOrPrevState === "string") {
    key = keyOrPrevState;
    formData = maybeFormData as FormData;
  } else {
    formData = prevStateOrFormData as FormData;
    const keyVal = formData.get("key");
    if (typeof keyVal !== "string") {
      notFound();
    }
    key = keyVal;
  }

  const result = validateWorkItemInput(formData);
  if (!result.ok) {
    return {
      errors: result.errors,
      values: result.values,
    };
  }

  try {
    const repo = getWorkItemRepository();
    const updated = await repo.update(key, result.data);

    if (!updated) {
      notFound();
    }

    revalidatePath("/workitems");
    revalidatePath(`/workitems/${key}`);
    redirect(`/workitems/${key}`);
  } catch (error) {
    if (isNextRouterError(error)) {
      throw error;
    }
    return {
      errors: {},
      values: result.values,
      message: "An unexpected error occurred while updating the work item. Please try again.",
    };
  }
}

export async function deleteWorkItem(keyOrFormData: string | FormData): Promise<void> {
  let key: string | null = null;
  if (typeof keyOrFormData === "string") {
    key = keyOrFormData;
  } else if (keyOrFormData instanceof FormData) {
    const val = keyOrFormData.get("key");
    if (typeof val === "string") {
      key = val;
    }
  }

  if (!key) {
    notFound();
  }

  const repo = getWorkItemRepository();
  const deleted = await repo.delete(key);

  if (!deleted) {
    notFound();
  }

  revalidatePath("/workitems");
  redirect("/workitems");
}
