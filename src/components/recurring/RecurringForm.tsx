import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FaCreditCard, FaWallet } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ACCOUNTS, Recurring, RecurringData } from "@/types";

const schema = z.object({
  amount: z.coerce.number().int().positive(),
  description: z.string(),
  account: z.enum(ACCOUNTS),
  dueDate: z.coerce.number().int().gte(1).lte(31),
});

const NewRecurring = ({
  setShowSheet,
  initialData = null,
  isEdit = false,
  onAdd,
  onEdit,
}: {
  setShowSheet: (show: boolean) => void;
  initialData?: Partial<Recurring> | null;
  isEdit?: boolean;
  onAdd: (recurring: RecurringData) => Promise<void>;
  onEdit: (recurringId: string, recurring: RecurringData) => Promise<void>;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<RecurringData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: initialData?.amount || "",
      description: initialData?.description || "",
      account: initialData?.account || "savings",
      dueDate: initialData?.dueDate || 1,
    },
  });

  const handleSubmit = (data: RecurringData) => {
    setIsSubmitting(true);
    console.log("Editing recurring:", data);

    if (isEdit) {
      //console.log("Editing recurring:", updatedData);
      if (initialData?.id) {
        onEdit(initialData.id, data);
      } else {
        console.error("No recurring ID found for editing");
      }
    } else {
      //console.log("Adding new recurring:", updatedData);
      onAdd(data);
    }
    setShowSheet(false);

    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  {" "}
                  {/* Container for prefix and input */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    €
                  </div>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="50.00"
                    aria-label="Amount"
                    className="pl-7"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Coffee at Starbucks"
                  aria-label="Description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="account"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <div className="w-full">
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}
                    className="inline-flex"
                  >
                    <ToggleGroupItem
                      value={ACCOUNTS[1]}
                      aria-label="Toggle expense"
                    >
                      <FaWallet className="text-yellow-600" />
                      {ACCOUNTS[1].charAt(0).toUpperCase() +
                        ACCOUNTS[1].slice(1)}{" "}
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value={ACCOUNTS[0]}
                      aria-label="Toggle income"
                    >
                      <FaCreditCard className="text-indigo-600" />
                      {ACCOUNTS[0].charAt(0).toUpperCase() +
                        ACCOUNTS[0].slice(1)}{" "}
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input
                  type="string"
                  inputMode="numeric"
                  placeholder="1"
                  aria-label="Due Date"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
export default NewRecurring;
