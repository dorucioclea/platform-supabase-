'use client';

import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { Message } from 'ai';
import { useLocalStorage } from '@mantine/hooks';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChatList } from '@/components/chat-list';
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor';
import { EmptyScreen } from '@/components/empty-screen';
import { ChatPanel } from '@/components/chat-panel';
import { useRouter } from 'next/navigation';
import { AIChat } from '@/types/primitives/ai-chat';
import useTranslation from 'next-translate/useTranslation';

export interface ChatProps extends React.ComponentProps<'div'> {
  chat?: AIChat;
  wsId: string;
  initialMessages?: Message[];
  chats: AIChat[];
  hasKey?: boolean;
}

const Chat = ({
  chat,
  wsId,
  initialMessages,
  chats,
  className,
  hasKey,
}: ChatProps) => {
  const { t } = useTranslation('ai-chat');
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [previewToken, setPreviewToken] = useLocalStorage({
    key: 'ai-token',
    defaultValue: '',
  });

  const [previewTokenDialog, setPreviewTokenDialog] = useState(false);
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken);

  useEffect(() => {
    // Don't show the dialog if the key is configured
    // on the server or the a preview token is set
    if (hasKey || previewToken) return;
    setPreviewTokenDialog(true);
  }, [previewToken, hasKey]);

  const [useEdge, setUseEdge] = useLocalStorage({
    key: 'use-edge-ai-api',
    defaultValue: true,
  });

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      id: chat?.id,
      initialMessages,
      api: `/api/chat/ai/${useEdge ? 'edge' : 'standard'}`,
      body: {
        id: chat?.id,
        wsId,
        previewToken,
      },
      onResponse(response) {
        if (!response.ok)
          toast({
            title: t('something_went_wrong'),
            description: t('try_again_later'),
          });
      },
      onError(_) {
        if (useEdge) {
          toast({
            title: t('something_went_wrong'),
            description: t('edge_api_opt_out'),
          });

          setUseEdge(false);
        } else {
          toast({
            title: t('something_went_wrong'),
            description: t('try_again_later'),
          });
        }
      },
    });

  useEffect(() => {
    if (!chat || !hasKey || isLoading) return;
    if (messages[messages.length - 1]?.role !== 'user') return;

    // Reload the chat if the user sends a message
    // but the AI did not respond yet after 1 second
    const timeout = setTimeout(() => {
      reload();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [chat, hasKey, isLoading, messages, reload]);

  const [collapsed, setCollapsed] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const updateInput = (input: string) => {
    setInput(input);
    if (inputRef.current) inputRef.current.focus();
  };

  const createChat = async (input: string) => {
    setLoading(true);

    const res = await fetch(`/api/chat`, {
      method: 'POST',
      body: JSON.stringify({
        message: input,
        previewToken,
      }),
    });

    if (!res.ok) {
      toast({
        title: t('something_went_wrong'),
        description: res.statusText,
      });
      setLoading(false);
      return;
    }

    const { id } = await res.json();
    if (id) {
      router.refresh();
      router.push(`/${wsId}/chat/${id}`);
    }
  };

  if (loading)
    return (
      <div className="mx-auto w-full max-w-2xl pt-8 lg:max-w-4xl">
        <div className="bg-foreground/5 flex h-96 animate-pulse items-center justify-center rounded-lg border p-8 text-center text-lg font-semibold md:text-xl">
          {t('creating_chat')}
        </div>
      </div>
    );

  return (
    <>
      <div id="chat-area" className={cn('pb-32 pt-4 md:pt-10', className)}>
        {chat && messages.length ? (
          <>
            <ChatList
              title={chat?.title}
              messages={messages.map((message) => {
                // If there is 2 repeated substring in the
                // message, we will merge them into one
                const content = message.content;
                const contentLength = content.length;
                const contentHalfLength = Math.floor(contentLength / 2);

                const firstHalf = content.substring(0, contentHalfLength);

                const secondHalf = content.substring(
                  contentHalfLength,
                  contentLength
                );

                if (firstHalf === secondHalf) message.content = firstHalf;
                return message;
              })}
            />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={updateInput} />
        )}
      </div>

      <ChatPanel
        id={chat?.id}
        chats={chats}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        inputRef={inputRef}
        setInput={setInput}
        createChat={createChat}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        defaultRoute={`/${wsId}/chat`}
        edge={useEdge}
      />

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your Anthropic Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your Anthropic API key, you can do so by{' '}
              <a
                href="https://console.anthropic.com/account/keys"
                className="underline"
              >
                generating an API key
              </a>{' '}
              on the Anthropic website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="Anthropic API key"
            onChange={(e) => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput);
                setPreviewTokenDialog(false);
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chat;
