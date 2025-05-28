
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import type { SaasPatient, SaasMembershipLevel } from '@/lib/types';

const NO_LEVEL_SELECTED_VALUE = "__NO_LEVEL_SELECTED__";

const memberEditSchema = z.object({
  membershipLevelId: z.string().optional(),
  points: z.coerce.number().int().min(0, "积分不能为负。").optional(),
});

type MemberEditFormValues = z.infer<typeof memberEditSchema>;

interface MemberEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberId: string, data: Partial<Pick<SaasPatient, 'membershipLevelId' | 'points'>>) => void;
  member: SaasPatient | null;
  membershipLevels: SaasMembershipLevel[];
}

export function MemberEditDialog({ isOpen, onClose, onSubmit, member, membershipLevels }: MemberEditDialogProps) {
  const form = useForm<MemberEditFormValues>({
    resolver: zodResolver(memberEditSchema),
    defaultValues: {
      membershipLevelId: member?.membershipLevelId || NO_LEVEL_SELECTED_VALUE,
      points: member?.points || 0,
    },
  });

  useEffect(() => {
    if (isOpen && member) {
      form.reset({
        membershipLevelId: member.membershipLevelId || NO_LEVEL_SELECTED_VALUE,
        points: member.points || 0,
      });
    }
  }, [member, isOpen, form]);

  const handleFormSubmit: SubmitHandler<MemberEditFormValues> = (data) => {
    if (!member) return;
    const dataToSubmit: Partial<Pick<SaasPatient, 'membershipLevelId' | 'points'>> = {
        membershipLevelId: data.membershipLevelId === NO_LEVEL_SELECTED_VALUE ? undefined : data.membershipLevelId,
        points: data.points
    };
    onSubmit(member.id, dataToSubmit);
  };

  if (!isOpen || !member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>编辑会员信息: {member.name}</DialogTitle>
          <DialogDescription>
            修改会员的等级和积分。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="membershipLevelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>会员等级</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="选择会员等级" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value={NO_LEVEL_SELECTED_VALUE}>无等级</SelectItem>
                      {membershipLevels.map(level => (
                        <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>当前积分</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">保存更改</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}

    