import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ElementType;
}

export function EmptyState({ 
  title = "No data found", 
  message = "There is currently no data available to display.", 
  icon: Icon = FolderOpen 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800 text-center h-full w-full min-h-[200px]">
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">{message}</p>
    </div>
  );
}
