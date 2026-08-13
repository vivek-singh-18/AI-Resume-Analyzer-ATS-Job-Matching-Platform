import React from "react";
import CardsItems from "./cards-items";

export function SectionCards({ data = [], isLoading = false }) {
  const totalDocuments = data?.length || 0;
  const processedDocuments =
    data?.filter((d) => d.analysis?.status === "done").length || 0;
  const pendingDocuments =
    data?.filter((d) => !d.analysis || d.analysis.status !== "done").length ||
    0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CardsItems
        item={{
          title: "Total Documents",
          description: isLoading ? null : totalDocuments,
          content: isLoading ? (
            <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" />
          ) : null,
          footerText: "Number of documents uploaded",
        }}
      />
      <CardsItems
        item={{
          title: "Processed Documents",
          description: isLoading ? null : processedDocuments,
          content: isLoading ? (
            <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" />
          ) : null,
          footerText: "Number of documents processed",
        }}
      />
      <CardsItems
        item={{
          title: "Pending Documents",
          description: isLoading ? null : pendingDocuments,
          content: isLoading ? (
            <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" />
          ) : null,
          footerText: "Number of documents pending",
        }}
      />
    </div>
  );
}

export default SectionCards;
