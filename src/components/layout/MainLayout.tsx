
import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface MainLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

export const MainLayout = ({ children, onLogout }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onLogout={onLogout} />
      <main className="flex-1">
        <div className="container py-8 px-4 md:px-6">
          {children}
        </div>
      </main>
      <footer className="py-6 border-t border-gray-200 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2025 CycleSense. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
