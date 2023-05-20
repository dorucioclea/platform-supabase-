import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@supabase/auth-helpers-react';
import UserProfilePopover from './UserProfilePopover';
import useTranslation from 'next-translate/useTranslation';
import { Bars3Icon, MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { ActionIcon, Popover } from '@mantine/core';
import { useState } from 'react';
import LanguageSelector from '../selectors/LanguageSelector';
import { useAppearance } from '../../hooks/useAppearance';

interface NavbarProps {
  hideNavLinks?: boolean;
}

const Navbar = ({ hideNavLinks }: NavbarProps) => {
  const { t } = useTranslation();
  const { theme, changeTheme } = useAppearance();

  const user = useUser();

  const login = t('common:login');
  const getStarted = t('common:get-started');

  const [opened, setOpened] = useState(false);

  const toggle = () => setOpened((o) => !o);
  const close = () => setOpened(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-10 flex items-center justify-between border-b p-4 font-semibold backdrop-blur-lg dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white md:px-32 lg:px-64">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex gap-2">
          <Image
            src="/media/logos/transparent.png"
            width={320}
            height={320}
            alt="logo"
            className="h-8 w-8"
          />
          <div className="mr-4 text-2xl dark:hover:text-blue-200">Tuturuuu</div>
        </Link>

        <LanguageSelector hideOnMobile />
        <ActionIcon
          onClick={() => changeTheme(theme === 'dark' ? 'light' : 'dark')}
          className="border border-zinc-300 bg-transparent hover:bg-zinc-200 dark:border-zinc-300/10 dark:bg-[#25262b] dark:hover:bg-[#454751]/40"
          size="lg"
        >
          {theme === 'dark' ? (
            <SunIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-300" />
          ) : (
            <MoonIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-300" />
          )}
        </ActionIcon>
      </div>

      {hideNavLinks ? null : user ? (
        <UserProfilePopover />
      ) : (
        <>
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/login"
              className="hover:text-blue-600 dark:hover:text-blue-200"
            >
              {login}
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-blue-500/10 bg-blue-500/10 px-4 py-1 text-blue-500 transition duration-300 hover:bg-blue-500/20 dark:border-blue-300/10 dark:bg-blue-300/20 dark:text-blue-300 dark:hover:bg-blue-300/30"
            >
              {getStarted}
            </Link>
          </div>

          <Popover
            opened={opened}
            onChange={setOpened}
            width={200}
            offset={8}
            position="top-end"
          >
            <Popover.Target>
              <button
                className="rounded p-1 hover:bg-zinc-300/10 md:hidden"
                onClick={toggle}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </Popover.Target>

            <Popover.Dropdown className="grid gap-2 p-2">
              <Link
                href="/login"
                onClick={close}
                className="rounded border border-zinc-300/10 bg-zinc-300/10 p-2 text-center font-semibold transition hover:bg-zinc-300/20"
              >
                {login}
              </Link>
              <Link
                href="/signup"
                onClick={close}
                className="rounded border border-blue-300/20 bg-blue-300/20 p-2 text-center font-semibold text-blue-300 transition hover:bg-blue-300/30"
              >
                {getStarted}
              </Link>
              <LanguageSelector fullWidth onChange={close} />
            </Popover.Dropdown>
          </Popover>
        </>
      )}
    </nav>
  );
};

export default Navbar;
