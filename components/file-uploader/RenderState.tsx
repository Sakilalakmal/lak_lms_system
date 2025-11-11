import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

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

export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleRemove,
}: {
  previewUrl: string;
  isDeleting?: boolean;
  handleRemove?: () => void;
}) {
  return (
    <div>
      <Image
        src={previewUrl}
        alt="upload file preview"
        fill
        className="object-contain p-2"
      />

      <Button
        onClick={handleRemove}
        disabled={isDeleting}
        type="button"
        variant={"destructive"}
        size={"icon"}
        className={cn("absolute top-4 right-4")}
      >
        {isDeleting ? (
          <Loader2 className="size-2 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function RenderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="text-center flex-justify-center items-center flex-col">
      <p>{progress}</p>
      <p className="mt-2 text-sm font-medium text-foreground">Uploading ...</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}
