"Use client";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: {
    displayName?: string | null;
    email: string | null;
    photoURL?: string | null;
  };
}

const UserMenu = ({ user }: UserMenuProps) => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut().then(() => router.push(`/auth`));
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.photoURL || undefined} />
          <AvatarFallback className="bg-gray-500 text-white text-sm font-bold">
            {user.displayName
              ? user.displayName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()
              : user.email?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <span className="block text-sm">
            {user.displayName || user.email}
          </span>
          <span className="block text-xs text-gray-500 truncate">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-500 hover:bg-red-100 dark:hover:bg-red-600 dark:hover:text-white">
          <button onClick={handleSignOut}>Sign out</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
