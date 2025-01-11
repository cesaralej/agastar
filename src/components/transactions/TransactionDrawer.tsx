import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

import NewTransaction from "./NewTransaction";

import { Transaction, TransactionData } from "@/types";

const TransactionDrawer = ({
  isEdit,
  showSheet,
  setShowSheet,
  initialData,
  onAdd,
  onEdit,
}: {
  isEdit?: boolean;
  showSheet: boolean;
  setShowSheet: (show: boolean) => void;
  initialData?: Partial<Transaction> | null;
  onAdd: (transaction: TransactionData) => Promise<void>;
  onEdit: (
    transactionId: string,
    transaction: TransactionData
  ) => Promise<void>;
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
              onAdd={onAdd}
              onEdit={onEdit}
            />
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
export default TransactionDrawer;
