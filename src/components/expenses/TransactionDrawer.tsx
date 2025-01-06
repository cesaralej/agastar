import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

import { PlusIcon } from "lucide-react";

import NewTransaction from "./NewTransaction";

const TransactionDrawer = () => {
  const [showSheet, setShowSheet] = useState(false);
  return (
    <Drawer open={showSheet} onOpenChange={setShowSheet}>
      <DrawerTrigger className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition duration-300 ease-in-out transform hover:scale-110">
        <PlusIcon size={24} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Transaction</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto">
          <div className="p-6">
            <NewTransaction setShowSheet={setShowSheet} />
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
export default TransactionDrawer;
