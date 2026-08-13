import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteDoc } from "@/utils/document";
import { Loader2, Trash } from "lucide-react";

export function DeleteButton({ doc, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDeleteDoc = async () => {
    try {
      setLoading(true);
      const res = await deleteDoc(doc);
      toast.success(res?.message || "Deleted");
      if (onDeleted) onDeleted();
    } catch (err) {
      toast.error("Failed to delete");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
      onClick={handleDeleteDoc}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Deleting...</span>
        </>
      ) : (
        <>
          <Trash className="h-4 w-4" />
          <span className="hidden md:inline">Delete</span>
        </>
      )}
    </Button>
  );
}
