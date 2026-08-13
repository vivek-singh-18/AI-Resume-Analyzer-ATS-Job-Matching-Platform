import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { downloadDoc } from "@/utils/document";

export function DownloadButton({ doc }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const res = await downloadDoc(doc);
      toast.success(res?.message || "Downloaded");
    } catch (err) {
      toast.error("Failed to donwload");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 flex items-center gap-2"
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">Download</span>
        </>
      )}
    </Button>
  );
}
