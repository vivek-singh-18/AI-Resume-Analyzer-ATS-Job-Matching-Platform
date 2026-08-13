import React, { useEffect, useState, useCallback } from "react";
import { SectionCards } from "@/components/elements/Dashboard/section-cards";
import SectionTable from "@/components/elements/Dashboard/section-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileUploader from "./Upload";
import { getDocs } from "@/utils/document";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const docs = await getDocs();
      setData(docs);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    return () => setData([]);
  }, [fetchData]);

  const handleUploadSuccess = () => {
    fetchData();
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-8 p-6 mt-14 max-w-8xl w-full mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Upload File</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[60%] p-0">
            <DialogTitle className="hidden" aria-hidden="true"></DialogTitle>
            <FileUploader
              className="px-4 w-full"
              onUploadSuccess={handleUploadSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <section>
        <SectionCards data={data} isLoading={isLoading} />
      </section>

      <section className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Uploads</h2>
        <SectionTable data={data} setData={setData} isLoading={isLoading} />
      </section>
    </div>
  );
}
