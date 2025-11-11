import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your file here or{" "}
        <span className="text-primary font-bold">Click to upload</span>
      </p>

      <Button className="mt-4" type="button">
        Drop Your File
      </Button>
    </div>
  );
}

export function RendorErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className="text-muted-foreground">Upload failed. Please try again.</p>
      <p className="text-xs text-muted mt-1">Something went wrong...</p>

      <Button type="button" variant={"outline"}>
        Retry Upload
      </Button>
    </div>
  );
}
