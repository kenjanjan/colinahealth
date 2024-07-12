"use client";
import Sidebar from "@/components/Sidebar";
import PatientOverviewComponent from "@/components/patientOverview";
import Footer from "@/components/footer";
import { EditProvider } from "@/app/(routes)/patient-overview/[id]/editContext";
import { useState, ReactNode } from "react";
import Image from "next/image";

const PatientOverviewPage = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenHovered, setIsOpenHovered] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  const onOpenHoverEnter = () => {
    setIsOpenHovered(true);
  };

  const onOpenHoverLeave = () => {
    setIsOpenHovered(false);
  };

  const onCloseHoverLeave = () => {
    setIsCloseHovered(false);
  };

  const onCloseHoverEnter = () => {
    setIsCloseHovered(true);
  };

  return (
    <div className="relative flex h-full">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onCloseHoverEnter={onCloseHoverEnter}
        onCloseHoverLeave={onCloseHoverLeave}
        isCloseHovered={isCloseHovered}
      />
      <div
        className={`absolute left-[19.4%] top-[9.5%] z-50  flex items-center justify-center rounded-[5px] bg-[#007C85] px-2 py-1 text-white transition-all duration-100 ${isCloseHovered ? "scale-100" : "scale-0"}`}
      >
        <h1>CLOSE</h1>
      </div>
      
      <div className="flex h-full w-full flex-col">
        <div
          className={`${isCollapsed ? "px-[150px]" : "px-[40px]"} h-full w-full flex-grow px-[150px] pt-[90px] transition-all duration-300`}
        >
          <EditProvider>
            <PatientOverviewComponent isCollapsed={isCollapsed} onOpenHoverEnter={onOpenHoverEnter} onOpenHoverLeave={onOpenHoverLeave} toggleSidebar={toggleSidebar} isOpenHovered={isOpenHovered}/>
            <div className="mt-4 flex w-full items-center justify-center">
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
