import {
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { CircleDotDashed } from "lucide-react";

export const statuses = [
  {
    value: "Pending",
    label: "Pending",
    icon: CircleDotDashed,
  },
  {
    value: "InProgress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "Done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "Canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
];
