'use client';
import Sidebar from "@/components/Sidebar";
import PatientOverviewComponent from "@/components/patientOverview";
import Footer from "@/components/footer";
import { EditProvider } from "@/app/(routes)/patient-overview/[id]/editContext";
import { useState, ReactNode } from "react";
import Image from "next/image";

const PatientOverviewPage = ({ children }: { children: ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleSidebar = () => {
        setIsCollapsed(prevState => !prevState);
    };

    return (
        <div className="relative flex h-full">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={`absolute left-4 top-[50%] transition-opacity duration-300 flex items-center gap-5 ${isCollapsed ? 'opacity-100' : 'opacity-0 hidden'}`}>
                <button onClick={toggleSidebar} className="cursor-pointer px-4 py-[20px] bg-[#0A4749] drop-shadow-lg rounded-full text-white font-semibold text-[20px]">
                    <Image src='/icons/double-arrow.svg' alt="double-arrow" width={28.04} height={18} />
                </button>
                <div className="bg-[#0A4749] rounded-[5px] text-white py-2 px-3">
                    <h1>OPEN</h1>
                </div>
            </div>
            <div className="flex flex-col w-full">
                <div className={`${isCollapsed?"pl-[150px]":"pl-[40px]"} transition-all duration-300 pr-[150px] pt-[90px] flex-grow`}>
                    <EditProvider>
                        <PatientOverviewComponent />
                        <div className="w-full flex items-center justify-center mt-4">
                            {children}
                        </div>
                    </EditProvider>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default PatientOverviewPage;
