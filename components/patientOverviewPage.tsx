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
        className={`absolute left-[19.4%] top-[9%] z-50  flex items-center justify-center rounded-[5px] bg-[#007C85] px-2 py-1 text-white transition-all duration-100 ${isCloseHovered ? "scale-100" : "scale-0"}`}
      >
        <h1>CLOSE</h1>
      </div>
      <div
        className={`absolute left-4 top-[50%] flex items-center gap-5 transition-opacity duration-300 ${isCollapsed ? "opacity-100" : "hidden opacity-0"}`}
      >
        <button
          onMouseEnter={onOpenHoverEnter}
          onMouseLeave={onOpenHoverLeave}
          onClick={toggleSidebar}
          className="relative flex cursor-pointer items-center justify-center rounded-full bg-[#007C85] p-7 font-semibold text-white drop-shadow-lg"
        >
          <Image
            className="absolute ml-1"
            src="/icons/double-arrow.svg"
            alt="double-arrow"
            width={28.04}
            height={18}
          />
        </button>
        <div
          className={`rounded-[5px] bg-[#007C85] px-3 py-2 text-white transition-all duration-100 ${isOpenHovered ? "scale-100" : "scale-0"}`}
        >
          <h1>OPEN</h1>
        </div>
      </div>
      <div className="flex h-full w-full flex-col">
        <div
          className={`${isCollapsed ? "pl-[150px]" : "pl-[40px]"} h-full w-full flex-grow pr-[150px] pt-[90px] transition-all duration-300`}
        >
          <EditProvider>
            <PatientOverviewComponent />
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
