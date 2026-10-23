"use client";

import { useRef, useState, useTransition } from "react";
import { deleteWorkItem } from "@/app/workitems/actions";

interface DeleteWorkItemButtonProps {
  itemKey: string;
  action?: (key: string) => Promise<void> | void;
}

export function DeleteWorkItemButton({ itemKey, action }: DeleteWorkItemButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleOpenDialog = () => {
    setIsOpen(true);
    if (dialogRef.current && typeof dialogRef.current.showModal === "function") {
      dialogRef.current.showModal();
    }
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    if (dialogRef.current && typeof dialogRef.current.close === "function") {
      dialogRef.current.close();
    }
  };

  const handleConfirmDelete = async () => {
    startTransition(async () => {
      if (action) {
        await action(itemKey);
      } else {
        await deleteWorkItem(itemKey);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenDialog}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors"
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        onClose={handleCloseDialog}
        aria-labelledby="dialog-title"
        className="rounded-lg border border-gray-300 p-6 shadow-xl backdrop:bg-black/50 max-w-md w-full bg-white m-auto"
      >
        <h2 id="dialog-title" className="text-lg font-bold text-gray-900 mb-2">
          Delete Work Item {itemKey}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to permanently delete this work item? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCloseDialog}
            disabled={isPending}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isPending}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </dialog>
    </>
  );
}
