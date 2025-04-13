import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

import BudgetForm from "./BudgetForm";

import { Budget } from "@/types";

const BudgetDrawer = ({
  showDrawer,
  setShowDrawer,
  initialData,
}: {
  showDrawer: boolean;
  setShowDrawer: (show: boolean) => void;
  initialData?: Partial<Budget> | null;
}) => {
  return (
    <Drawer open={showDrawer} onOpenChange={setShowDrawer}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Update Budget</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto">
          <div className="p-6">
            <BudgetForm
              setShowSheet={setShowDrawer}
              initialData={initialData}
            />
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
export default BudgetDrawer;
