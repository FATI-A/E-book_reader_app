import React from "react";
import { ChevronRight } from "lucide-react";

export default function SectionHeader({
  title,
  actionLabel = "See more",
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg sm:text-xl font-semibold">
        {title}
      </h2>

      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        {actionLabel}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
