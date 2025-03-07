'use client'

import { Button, Grid, Select, TextInput, Title } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { logger } from '@shega/shared';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Link from '@tiptap/extension-link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJob } from 'app/[locale]/_api/organizations/create-jobs';
import { notifications } from '@mantine/notifications';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useIsAuthorized from '@/hooks/useIsAuthorized';

export const jobSchema = z.object({
  title: z.string().min(1, { message: 'Job title is required' }),
  salary: z.string().min(1, { message: 'Salary is required' }),
  type: z.string().min(1, { message: 'Job type is required' }),
  currency: z.string().min(1, { message: 'Currency is required' }),
  salaryFrom: z.number().min(1, { message: 'Salary from is required' }),
  salaryTo: z.number().min(1, { message: 'Salary to is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

// Infer the type from the schema
export type JobFormData = z.infer<typeof jobSchema>;

const PostJobForm = () => {
  const { user } = useIsAuthorized({ resourceRole: 'work_provider', userRole: 'work_provider' });
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
  });

  const queryClient = useQueryClient();

  const jobMutation = useMutation({
    mutationFn: createJob,
    mutationKey: ['jobs'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      notifications.show({
        title: 'Success',
        message: 'Job created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });

  // Initialize TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: watch('description'), // Sync editor content with form state
  });

  const onSubmit = (data: JobFormData) => {
    jobMutation.mutate({
      ...data,
      organizationId: user?.organizationId ?? '',
      description: editor?.getHTML() ?? '',
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <Title order={2}>Post Job</Title>
        <Button variant="outline">Back to List</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Job Title */}
        <TextInput
          label="Job Title"
          required
          placeholder="Frontend Developer"
          {...register('title')}
          error={errors.title?.message}
        />

        <Grid gutter="md">
          {/* Salary From */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Salary From"
              placeholder="1000"
              type="number"
              {...register('salaryFrom', { valueAsNumber: true })}
              error={errors.salaryFrom?.message}
            />
          </Grid.Col>

          {/* Salary To */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Salary To"
              placeholder="1500"
              type="number"
              {...register('salaryTo', { valueAsNumber: true })}
              error={errors.salaryTo?.message}
            />
          </Grid.Col>

          {/* Currency */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Controller
              name="currency"
              control={control}
              defaultValue="ETB"
              render={({ field }) => (
                <Select
                  label="Currency"
                  required
                  placeholder="Select currency"
                  data={['ETB', 'USD', 'EUR', 'GBP']}
                  {...field}
                  error={errors.currency?.message}
                />
              )}
            />
          </Grid.Col>

          {/* Employment Type */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Controller
              name="type"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  label="Employment Type"
                  required
                  placeholder="Select type"
                  data={['Full-time', 'Part-time', 'Contract', 'Internship']}
                  {...field}
                  error={errors.type?.message}
                />
              )}
            />
          </Grid.Col>
        </Grid>

        {/* Location */}
        <Controller
          name="location"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              label="Location"
              required
              placeholder="Select Location"
              data={['Addis Ababa', 'Bahir Dar', 'Hawassa', 'Dire Dawa']}
              {...field}
              error={errors.location?.message}
            />
          )}
        />

        {/* Rich Text Editor for Description */}
        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <RichTextEditor
                editor={editor}
                onUpdate={({ editor }) => field.onChange(editor.getHTML())}
                className="min-h-[200px]"
              >
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                    <RichTextEditor.Subscript />
                    <RichTextEditor.Superscript />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content />
              </RichTextEditor>
              {errors.description && (
                <span className="text-red-500 text-sm">{errors.description.message}</span>
              )}
            </div>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" fullWidth loading={jobMutation.isPending}>
          Post Job
        </Button>
      </form>
    </div>
  );
};

export default PostJobForm;