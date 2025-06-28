import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface NavBarProps {
  isLoggedIn: boolean;
  onLoginClick?: () => void;
  onSignOut?: () => void;
}

export function NavBar({ isLoggedIn, onLoginClick, onSignOut }: NavBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto py-3 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo-light.png"
            alt="Haikoo Logo"
            width={100}
            height={40}
            priority
          />
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="#inspiration" className="text-gray-600 hover:text-gray-900">
            Inspiration
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">
            How It Works
          </Link>
          {isLoggedIn ? (
            <Button onClick={onSignOut}>
              Sign Out
            </Button>
          ) : (
            <Button onClick={onLoginClick}>
              Sign Up
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
