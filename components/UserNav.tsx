"use client";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar } from "./ui/avatar";
import Logo from "../public/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { UserRoundCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { LOGOUT } from "../graphql/actions/mutations/users/logout.action";
import Cookies from "js-cookie";
import { useApolloClient, useMutation } from "@apollo/client";
import { toast } from "sonner";
import useUser from "../hooks/useUser";

export function UserNav() {
  const { user } = useUser();
  const client = useApolloClient();
  const router = useRouter();
  const [logOut, { loading }] = useMutation(LOGOUT);

  const handleLogout = async () => {
    try {
      await logOut();
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      await client.clearStore();
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (err: any) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Logout error:", err);
      }
      if (err.message.includes("Please login to access this resource!")) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        await client.clearStore();
        toast.success("Logged out successfully!");
        router.push("/");
      } else {
        toast.error("ُError during log out");
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full  bg-white/90  hover:bg-white/100 transition-colors"
        >
          <Avatar className="h-12 w-12 flex justify-center items-center mx-auto">
            <Image
              src={Logo}
              alt="The_LOGO"
              width={100}
              height={100}
              className=" w-[35px] h-[35px] rounded-full "
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/dashboard/settings`}>
            <DropdownMenuItem className=" cursor-pointer">
              <UserRoundCog size={20} className="mr-2" />
              Settings{" "}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={loading}
          className=" cursor-pointer"
        >
          <LogOut size={20} className="mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
