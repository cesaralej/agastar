import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

import NewTransaction from "./NewTransaction";

import { Transaction } from "@/types";

const TransactionDrawer = ({
  isEdit,
  showSheet,
  setShowSheet,
  initialData,
}: {
  isEdit?: boolean;
  showSheet: boolean;
  setShowSheet: (show: boolean) => void;
  initialData?: Partial<Transaction> | null;
}) => {
  return (
    <Drawer open={showSheet} onOpenChange={setShowSheet}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {isEdit ? "Update Transaction" : "Add Transaction"}
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto">
          <div className="p-6">
            <NewTransaction
              setShowSheet={setShowSheet}
              initialData={initialData}
              isEdit={isEdit}
            />
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
export default TransactionDrawer;
