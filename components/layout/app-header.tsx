import * as React from "react";

type AppHeaderProps = {
  title?: React.ReactNode;
  actions?: React.ReactNode;
};

export default function AppHeader({ title, actions }: AppHeaderProps) {
  return (
    <header className="fixed top-0 left-0 z-50 w-full p-4 bg-red-500">
      <div className="flex items-center justify-around py-4 px-6 w-full">
        <div>{title}</div>
        {actions}
      </div>
    </header>
  );
}
