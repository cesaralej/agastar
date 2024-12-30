import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Type } from "lucide-react";
import { time } from "console";
import { comment } from "postcss";

const schema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  description: z.string(),
  type: z.enum(["income", "expense"]),
  account: z.enum(["credit", "savings"]),
  category: z.enum(["food", "transport", "housing", "utilities", "other"]),
  date: z.date(),
  time: z.string(),
  isCreditCard: z.boolean(),
  comment: z.string().optional(),
});

const NewTransaction = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      description: "",
      type: "expense",
      account: "credit",
      category: "other",
      date: new Date(),
      time: "",
      isCreditCard: false,
      comment: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };

  return (
    <Drawer>
      <DrawerTrigger className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
        Open
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Transaction</DrawerTitle>
        </DrawerHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="50" {...field} />
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
                    <Input placeholder="e.g., Coffee at Starbucks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Coffee at Starbucks"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
export default NewTransaction;
