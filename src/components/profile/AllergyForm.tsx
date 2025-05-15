
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { UserProfile } from "@/lib/types";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const allergyOptions = [
  "青霉素", "头孢类", "海鲜", "牛奶", "花粉或尘螨", 
  "洗洁剂", "化妆品", "磺胺类", "链黄素", "鸡蛋", "粉尘", "其他"
];

const allergyFormSchema = z.object({
  selectedAllergies: z.array(z.string()).optional(),
  otherAllergyText: z.string().optional(),
}).refine(data => {
  // If "其他" is selected, then otherAllergyText must not be empty or just whitespace
  if (data.selectedAllergies?.includes("其他") && (!data.otherAllergyText || data.otherAllergyText.trim() === "")) {
    return false; 
  }
  return true;
}, {
  message: "请填写“其他”过敏项的具体内容。",
  path: ["otherAllergyText"], // Point error to this field
});

type AllergyFormValues = z.infer<typeof allergyFormSchema>;

interface AllergyFormProps {
  initialAllergies?: string[];
  initialOtherAllergyText?: string;
  onSave: (data: { allergies?: string[]; otherAllergyText?: string }) => void;
}

export function AllergyForm({ initialAllergies, initialOtherAllergyText, onSave }: AllergyFormProps) {
  const { toast } = useToast();
  
  const form = useForm<AllergyFormValues>({
    resolver: zodResolver(allergyFormSchema),
    defaultValues: {
      selectedAllergies: initialAllergies || [],
      otherAllergyText: initialOtherAllergyText || "",
    },
  });

  const watchedAllergies = form.watch("selectedAllergies");
  const showOtherInput = !!watchedAllergies?.includes("其他"); // Ensure boolean conversion

  useEffect(() => {
    form.reset({
      selectedAllergies: initialAllergies || [],
      otherAllergyText: initialOtherAllergyText || "",
    });
  }, [initialAllergies, initialOtherAllergyText, form]);

  function onSubmit(data: AllergyFormValues) {
    // If "其他" is not selected, clear the otherAllergyText before saving
    const dataToSave = {
      allergies: data.selectedAllergies,
      otherAllergyText: data.selectedAllergies?.includes("其他") ? data.otherAllergyText : "",
    };
    onSave(dataToSave);
    toast({
      title: "过敏史已保存",
      description: "您的过敏史信息已更新。",
    });
  }

  return (
    <Card className="shadow-sm mt-4"> {/* Added mt-4 for consistent spacing with other tab contents */}
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">编辑过敏史</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="selectedAllergies"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm">请选择已知的过敏物质：</FormLabel>
                  <ScrollArea className="h-48 w-full rounded-md border p-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                      {allergyOptions.map((allergy) => (
                        <FormField
                          key={allergy}
                          control={form.control}
                          name="selectedAllergies"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={allergy}
                                className="flex flex-row items-center space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(allergy)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), allergy])
                                        : field.onChange(
                                            (field.value || []).filter(
                                              (value) => value !== allergy
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-xs font-normal leading-tight">
                                  {allergy}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showOtherInput && (
              <FormField
                control={form.control}
                name="otherAllergyText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>其他过敏物质说明</FormLabel>
                    <FormControl>
                      <Input placeholder="请具体说明其他过敏物质" {...field} />
                    </FormControl>
                    <FormMessage /> {/* This will show the custom error message if "其他" is checked and text is empty */}
                  </FormItem>
                )}
              />
            )}
            
            <div className="flex justify-end">
              <Button type="submit">保存过敏史</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    