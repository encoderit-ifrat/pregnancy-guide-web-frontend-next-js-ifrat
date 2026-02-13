import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
type AppDialogProps = {
  children: ReactNode | ((close: () => void) => ReactNode);
  triggerText?: string;
  triggerClassName?: string;
  triggerVariant?:
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "tertiary";
  title?: string;
  description?: string;
  customTrigger?: ReactNode;
  dialogContentProps?: React.ComponentProps<typeof DialogContent>;
};
export const AppDialog: React.FC<AppDialogProps> = ({
  children,
  triggerText = "Open Dialog",
  triggerClassName = "lg:text-xl sm:text-xs text-text-dark",
  triggerVariant = "link",
  title = "Dialog Title",
  description = "",
  customTrigger,
  dialogContentProps,
}) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {customTrigger || (
          <Button variant="default" className={triggerClassName}>
            {triggerText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={cn(
          "max-h-[90vh] overflow-y-auto",
          dialogContentProps?.className
        )}
        {...dialogContentProps}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {typeof children === "function" ? children(handleClose) : children}
      </DialogContent>
    </Dialog>
  );
};
