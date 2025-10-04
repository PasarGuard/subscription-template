import type { ReactNode } from "react";
import { Footer } from "./footer";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="relative flex min-h-screen flex-col bg-muted/20">
            <main className="flex-1 animate-fadeIn">
                {children}
            </main>
            <Footer />
        </div>
    );
}

