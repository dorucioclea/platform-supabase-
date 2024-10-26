import { TailwindAdvancedEditor } from '../../../../../documents/components/text-editor/advanced-editor';
import { CourseSection } from '../../section';
import FileDisplay from './resources/file-display';
import { YoutubeEmbed } from './youtube-links/embed';
import { WorkspaceCourseModule } from '@/types/db';
import { createClient, createDynamicClient } from '@/utils/supabase/server';
import { Separator } from '@repo/ui/components/ui/separator';
import {
  BookText,
  Goal,
  ListTodo,
  Paperclip,
  SwatchBook,
  Youtube,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { JSONContent } from 'novel';

interface Props {
  params: Promise<{
    locale: string;
    wsId: string;
    courseId: string;
    moduleId: string;
  }>;
}

export default async function UserGroupDetailsPage({ params }: Props) {
  const t = await getTranslations();
  const { wsId, courseId, moduleId } = await params;
  const data = await getModuleData(courseId, moduleId);

  const storagePath = `${wsId}/courses/${courseId}/modules/${moduleId}/resources/`;
  const resources = await getResources({ path: storagePath });

  return (
    <div className="grid gap-4">
      <CourseSection
        href={`/${wsId}/education/courses/${courseId}/modules/${moduleId}/content`}
        title={t('course-details-tabs.module_content')}
        icon={<Goal className="h-5 w-5" />}
        rawContent={data.content as JSONContent | undefined}
        content={
          data.content ? (
            <TailwindAdvancedEditor
              content={data.content as JSONContent}
              disableLocalStorage
              previewMode
            />
          ) : undefined
        }
      />
      <CourseSection
        href={`/${wsId}/education/courses/${courseId}/modules/${moduleId}/resources`}
        title={t('course-details-tabs.resources')}
        icon={<Paperclip className="h-5 w-5" />}
        content={
          resources &&
          resources.length > 0 && (
            <div className="grid gap-4">
              {resources.map((file, index) => (
                <div
                  key={`${index}-${file}`}
                  className="flex flex-wrap items-center gap-2"
                >
                  <div className="font-semibold hover:underline">
                    {file.name
                      // remove leading UUID_ from file name
                      .replace(
                        /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_/,
                        ''
                      )}
                  </div>
                  <Separator className="my-2" />
                  <div className="w-full">
                    <FileDisplay path={storagePath} file={file} />
                  </div>
                </div>
              ))}
            </div>
          )
        }
      />
      <CourseSection
        href={`/${wsId}/education/courses/${courseId}/modules/${moduleId}/youtube-links`}
        title={t('course-details-tabs.youtube_links')}
        icon={<Youtube className="h-5 w-5" />}
        content={
          data.youtube_links && data.youtube_links.length > 0 ? (
            <div className="grid gap-4">
              {data.youtube_links.map((link: string, index: number) => (
                <YoutubeEmbed key={index} embedId={link.split('v=')[1]} />
              ))}
            </div>
          ) : undefined
        }
      />
      <CourseSection
        href={`/${wsId}/education/courses/${courseId}/modules/${moduleId}/quizzes`}
        title={t('ws-quizzes.plural')}
        icon={<ListTodo className="h-5 w-5" />}
      />
      <CourseSection
        href={`/${wsId}/education/courses/${courseId}/modules/${moduleId}/flashcards`}
        title={t('ws-flashcards.plural')}
        icon={<SwatchBook className="h-5 w-5" />}
      />
      <CourseSection
        href={`/${wsId}/education/courses/${courseId}/modules/${moduleId}/extra-content`}
        title={t('course-details-tabs.extra_reading')}
        icon={<BookText className="h-5 w-5" />}
        rawContent={data.extra_content as JSONContent | undefined}
        content={
          data.extra_content ? (
            <TailwindAdvancedEditor
              content={data.extra_content as JSONContent}
              disableLocalStorage
              previewMode
            />
          ) : undefined
        }
      />
    </div>
  );
}

const getModuleData = async (courseId: string, moduleId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('workspace_course_modules')
    .select('*')
    .eq('id', moduleId)
    .eq('course_id', courseId)
    .single();

  if (error) {
    console.error('error', error);
  }

  return data as WorkspaceCourseModule;
};

async function getResources({ path }: { path: string }) {
  const supabase = await createDynamicClient();

  const { data, error } = await supabase.storage.from('workspaces').list(path, {
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) throw error;

  return data;
}
