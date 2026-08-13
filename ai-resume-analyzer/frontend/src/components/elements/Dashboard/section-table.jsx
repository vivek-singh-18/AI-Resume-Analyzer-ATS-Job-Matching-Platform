import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FolderCode } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyzeButton } from "./button-groups/AnalyzeButton";
import { DeleteButton } from "./button-groups/DeleteButton";
import { DownloadButton } from "./button-groups/DownloadButton";
import { ViewButton } from "./button-groups/ViewButton";

export default function SectionTable({ data, setData, isLoading = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const skeletonRows = Array(rowsPerPage).fill(0);

  const handleStatusUpdate = (updatedDoc) => {
    setData((prev) =>
      prev.map((d) => (d._id === updatedDoc._id ? updatedDoc : d))
    );
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="w-full space-y-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden p-4">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              skeletonRows.map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-28 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FolderCode />
                    <p>No Files Uploaded</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row._id}>
                  <TableCell className="truncate">{row.originalName}</TableCell>
                  <TableCell className="capitalize truncate">
                    {row.mimeType ? row.mimeType.split("/")[1] : "Unknown"}
                  </TableCell>
                  <TableCell className="truncate">{row.size}</TableCell>
                  <TableCell className="truncate">
                    {new Date(row.updatedAt || row.uploadedAt).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </TableCell>
                  <TableCell className="text-right max-w-[250px]">
                    <div className="flex flex-wrap justify-end gap-2">
                      <AnalyzeButton
                        doc={row}
                        onStatusUpdate={handleStatusUpdate}
                      />
                      <ViewButton doc={row} />
                      <DownloadButton doc={row} />
                      <DeleteButton
                        doc={row}
                        onDeleted={() =>
                          setData((prev) =>
                            prev.filter((d) => d._id !== row._id)
                          )
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-2 sm:gap-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {isLoading ? (
              <Skeleton className="h-4 w-36" />
            ) : (
              `Showing ${paginatedData.length} of ${data.length} entries`
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages && totalPages > 0}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
