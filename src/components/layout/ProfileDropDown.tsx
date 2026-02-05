import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { User, LogOut } from "lucide-react";
import Link from "next/link";

export function ProfileDropDown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="size-12">
          <AvatarFallback className="bg-primary/20 text-popover-foreground uppercase">
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem className="hover:bg-black/5">
            <User className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <Link href="/change-password">
          <DropdownMenuItem className="hover:bg-black/5">
            <User className="mr-2 size-4" />
            Change Password
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          className="hover:bg-black/5"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 size-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
