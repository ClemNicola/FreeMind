import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content md:min-h-32 min-h-24 max-w-lg w-full rounded-lg border border-dark_blue bg-transparent px-2.5 py-2 text-base text-dark_blue outline-none placeholder:text-dark_blue/50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
