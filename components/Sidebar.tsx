'use client';
import { cn } from '@/lib/utils';
import React from 'react';

interface SideBarProps {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SideBarProps) => {

    const toggleSidebar = () => {
        setIsCollapsed(prevState => !prevState);
    };

    return (
        <aside className={cn('bg-[#06393A] transition-width duration-300 relative', { 'w-3/12': !isCollapsed, 'w-0': isCollapsed })}>
            <button onClick={toggleSidebar} className="p-2 bg-[#0A4749] rounded-l-[5px] text-white absolute right-0 top-[50%] font-semibold text-[20px]">
                {isCollapsed ? '>' : '<'}
            </button>
        </aside>
    );
};

export default Sidebar;
