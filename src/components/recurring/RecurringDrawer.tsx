import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import RecurringForm from "@/components/recurring/RecurringForm";

import { Recurring, RecurringData } from "@/types";

const RecurringDrawer = ({
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
  initialData?: Partial<Recurring> | null;
  onAdd: (recurring: RecurringData) => Promise<void>;
  onEdit: (recurringId: string, recurring: RecurringData) => Promise<void>;
}) => {
  return (
    <Drawer open={showSheet} onOpenChange={setShowSheet}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {isEdit ? "Update Recurring" : "Add Recurring"}
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto">
          <div className="p-6">
            <RecurringForm
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
export default RecurringDrawer;
