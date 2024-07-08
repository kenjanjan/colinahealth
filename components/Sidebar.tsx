"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ResuableTooltip from "./reusable/tooltip";

interface SideBarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseHoverLeave: () => void;
  onCloseHoverEnter: () => void;
  isCloseHovered: boolean;
}

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  onCloseHoverLeave,
  onCloseHoverEnter,
  isCloseHovered,
}: SideBarProps) => {
  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  return (
    <aside
      className={cn(
        "transition-width relative w-[23%] overflow-hidden bg-[#06393A] pt-[90px] text-white duration-300",
        { "w-0 opacity-0": isCollapsed },
      )}
    >
      <div
        className={`px-5 transition-all ${isCollapsed ? "-translate-x-[200px]" : ""}`}
      >
        <div className="flex justify-between">
          <h1 className="text-[20px] font-semibold">Latest Report</h1>
          <Image
            onClick={toggleSidebar}
            onMouseEnter={onCloseHoverEnter}
            onMouseLeave={onCloseHoverLeave}
            src={`${isCloseHovered ? "/icons/sidebar-close-hover.svg" : "/icons/sidebar-close.svg"}`}
            alt="sidebar-close"
            width={8}
            height={8}
            className="cursor-pointer text-[20px] text-white"
          />
        </div>
        <div className="sidebar-divider" />
        <h1 className="font-semibold text-[#FCFF9D]">
          Admission Date: 10/24/2023
        </h1>
        <div className="sidebar-divider" />
        <div className="flex flex-col">
          <h1 className="font-semibold text-[#4FF4FF]">
            Recent Medication{" "}
            <span className="text-[#FCFF9D]"><span className="text-white">-</span> 02/23/42 : 10:00AM</span>
          </h1>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Status:</div>
            <div className="w-fit rounded-[5px] bg-[#1EBC10] px-2 py-0.5 text-[12px]">
              Given
            </div>
          </div>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Medication</div>
            <div>Nasal Steroids</div>
          </div>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Note:</div>
            <div className="truncate">
              <ResuableTooltip text={"Patient advice to follow-up dsadasd"} />
            </div>
          </div>
        </div>

        <div className="sidebar-divider" />
        <div className="flex flex-col">
          <h1 className="font-semibold text-[#4FF4FF]">
            PRN <span className="text-[#FCFF9D]"><span className="text-white">-</span> 02/23/42 : 10:00AM</span>
          </h1>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Status:</div>
            <div className="w-fit rounded-[5px] bg-[#FF5B78] px-2 py-0.5 text-[12px]">
              Refused
            </div>
          </div>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Medication</div>
            <div>Nasal Steroids</div>
          </div>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Note:</div>
            <div className="truncate">
              <ResuableTooltip text={"Patient advice to follow-up dsadasd"} />
            </div>
          </div>
        </div>

        <div className="sidebar-divider" />
        <div className="flex flex-col">
          <h1 className="mb-1 font-semibold text-[#4FF4FF]">
            Vital Sign{" "}
            <span className="text-[#FCFF9D]"><span className="text-white">-</span> 02/23/42 : 10:00AM</span>
          </h1>
          <div className="grid grid-cols-6">
            <div className="col-span-2">BP (mmHg):</div>
            <div className="col-span-1 truncate border-r border-gray-200 pr-1">
              130/80
            </div>
            <div className="col-span-2 ml-5">Temp (°F):</div>
            <div className="col-span-1">90</div>
          </div>
          <div className="grid grid-cols-6">
            <div className="col-span-2">HR (bpm): </div>
            <div className="col-span-1 truncate border-r border-gray-200 pr-1">
              80
            </div>
            <div className="col-span-2 ml-5">Resp:</div>
            <div className="col-span-1 truncate">
              <ResuableTooltip text={"20 breaths per second"} />
            </div>
          </div>
        </div>

        <div className="sidebar-divider" />
        <div className="flex flex-col">
          <h1 className="mb-1 font-semibold text-[#4FF4FF]">
            Lab Results{" "}
            <span className="text-[#FCFF9D]"><span className="text-white">-</span> 02/23/42 : 10:00AM</span>
          </h1>
          <div className="grid grid-cols-6">
            <div className="col-span-2">Hemo A1c:</div>
            <div className="col-span-1 truncate border-r border-gray-200 pr-1">
              50%
            </div>
            <div className="col-span-2 ml-5">LDL-C:</div>
            <div className="col-span-1 truncate">
              <ResuableTooltip text={"41 mg/dl"} />
            </div>
          </div>
          <div className="grid grid-cols-6">
            <div className="col-span-2">FBG: </div>
            <div className="col-span-1 truncate border-r border-gray-200 pr-1">
              <ResuableTooltip text={"12 mg/dl"} />
            </div>
            <div className="col-span-2 ml-5">HDL-C:</div>
            <div className="col-span-1 truncate">
              <ResuableTooltip text={"45 mg/dl"} />
            </div>
          </div>
          <div className="grid grid-cols-6">
            <div className="col-span-2">TC: </div>
            <div className="col-span-1 truncate border-r border-gray-200 pr-1">
              <ResuableTooltip text={"32 mg/dl"} />
            </div>
            <div className="col-span-2 ml-5">TG:</div>
            <div className="col-span-1 truncate">
              <ResuableTooltip text={"10 mg/dl"} />
            </div>
          </div>
        </div>

        <div className="sidebar-divider" />
        <div className="flex flex-col">
          <h1 className="mb-1 font-semibold text-[#4FF4FF]">Active Meds</h1>
          <div className="grid grid-cols-6">
            <div className="col-span-2 truncate">
              <ResuableTooltip text={"Neozep Neozep Neozep"} />
            </div>
            <div className="col-span-1 truncate border-r border-gray-200 pr-1">
              <ResuableTooltip text={"200mg"} />
            </div>
            <div className="col-span-2 ml-5 truncate">
              <ResuableTooltip text={"Amoxicillin"} />
            </div>
            <div className="col-span-1 truncate">
              <ResuableTooltip text={"500mg"} />
            </div>
          </div>
          <div className="grid grid-cols-6">
            <div className="col-span-2 truncate">
              <ResuableTooltip text={"Alaxan"} />{" "}
            </div>
            <div className="col-span-1 truncate border-r border-gray-200 pr-1">
              <ResuableTooltip text={"200mg"} />
            </div>
            <div className="col-span-2 ml-5">
              <ResuableTooltip text={"Biogesic"} />
            </div>
            <div className="col-span-1 truncate">
              <ResuableTooltip text={"500mg"} />
            </div>
          </div>
          <div className="grid grid-cols-6">
            <div className="col-span-2 truncate">
              <ResuableTooltip text={"Medicol"} />{" "}
            </div>
            <div className="col-span-1 truncate border-r border-gray-200 pr-1">
              <ResuableTooltip text={"500mg"} />
            </div>
            <div className="col-span-2 ml-5 truncate">
              <ResuableTooltip text={"Sulmox"} />
            </div>
            <div className="col-span-1 truncate">
              <ResuableTooltip text={"500mg"} />
            </div>
          </div>
          <div className="sidebar-divider" />
          <h1 className="mb-1 font-semibold text-[#4FF4FF]">
            Nurse's Note{" "}
            <span className="text-[#FCFF9D]">
              <span className="text-white">-</span> 02/23/42 : 10:00AM
            </span>
          </h1>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Subject:</div>
            <div className="truncate">
              <ResuableTooltip text={"Health Problem"} />
            </div>
          </div>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Notes:</div>
            <div className="truncate">
              <ResuableTooltip text={"Patient reports occasional headaches"} />
            </div>
          </div>
          <div className="sidebar-divider" />
          <h1 className="mb-1 font-semibold text-[#4FF4FF]">
            Incident Report
            <span className="text-[#FCFF9D]">
              <span className="text-white"> -</span> 02/23/42 : 10:00AM
            </span>
          </h1>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Subject:</div>
            <div className="truncate">
              <ResuableTooltip text={"Health Problem"} />
            </div>
          </div>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Details:</div>
            <div className="truncate">
              <ResuableTooltip text={"Patient reports occasional headaches"} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
