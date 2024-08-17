import { UserGroupPost } from '../../users/groups/[groupId]/posts/[postId]/card';
import { Head, Html, Img, Tailwind } from '@react-email/components';

interface Props {
  post: UserGroupPost;
  isHomeworkDone?: boolean;
}

const PostEmailTemplate = ({ post, isHomeworkDone }: Props) => {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

  return (
    <Html>
      <Head />
      <Tailwind>
        <div className="m-4 rounded-lg border bg-gray-100 p-6 font-sans">
          <div className="mx-auto max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="px-6 py-4">
              <div className="text-center">
                <div className="w-full text-center">
                  <Img
                    src={`${baseUrl}/media/logos/easy.png`}
                    width="100"
                    height="38"
                  />
                  <div className="text-lg font-bold text-gray-800">
                    Easy Center
                  </div>
                  <div className="font-semibold text-gray-500">
                    24 Trường Sa - Phước Long - Nha Trang
                  </div>
                  <div className="text-sm text-gray-500">
                    (0258) 6557 457 - 0977 183 161
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="px-6 py-4">
              <div className="flex w-full items-center justify-center text-center">
                <div className="w-fit rounded-full bg-black px-4 py-1 text-xs font-semibold text-white">
                  Tiếng Việt
                </div>
              </div>
              <div className="w-full pt-4 text-center">
                <div className="text-center font-semibold uppercase">
                  Báo cáo tiến độ học tập theo ngày
                </div>
                {isHomeworkDone !== undefined && (
                  <div className="text-lg text-red-500">
                    {isHomeworkDone ? 'Đã làm bài tập' : 'Chưa làm bài tập'}
                  </div>
                )}
                <div className="text-blue-500">{post.group_name}</div>
              </div>
              <p className="text-sm text-gray-600">
                Trung tâm Easy thân gửi phụ huynh báo cáo tiến độ học tập của em{' '}
                <span className="font-semibold text-purple-600">
                  Huỳnh Tấn Phát
                </span>{' '}
                trong ngày{' '}
                {new Date().toLocaleDateString('vi', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                , lớp{' '}
                <span className="font-semibold underline">
                  {post.group_name}
                </span>
                , với nội dung như sau:
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Bài học:</span>{' '}
                <span className="">{post.title}</span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Nội dung:</span> {post.content}
              </p>
            </div>
            <hr />
            <div className="px-6 py-4">
              <div className="flex w-full items-center justify-center text-center">
                <div className="w-fit rounded-full bg-black px-4 py-1 text-xs font-semibold text-white">
                  English
                </div>
              </div>
              <div className="w-full pt-4 text-center">
                <div className="text-center font-semibold uppercase">
                  Daily learning progress report
                </div>
                <div className="text-lg text-red-500">
                  {isHomeworkDone ? 'Homework done' : 'Homework not done'}
                </div>
                <div className="text-blue-500">{post.group_name}</div>
              </div>
              <p className="text-sm text-gray-600">
                Easy Center kindly sends parents a report on the learning
                progress of{' '}
                <span className="font-semibold text-purple-600">
                  Huỳnh Tấn Phát
                </span>{' '}
                on{' '}
                {new Date().toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                , class{' '}
                <span className="font-semibold underline">
                  {post.group_name}
                </span>
                , with the following content:
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Lesson:</span>{' '}
                <span className="">{post.title}</span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Content:</span> {post.content}
              </p>
            </div>
          </div>
        </div>
      </Tailwind>
    </Html>
  );
};

export default PostEmailTemplate;
