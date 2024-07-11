import React from "react";
import ResuableTooltip from "../reusable/tooltip";
import ActiveMedsLoaders from "./loaders/activeMedsLoaders";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useIsTruncated from "../hooks/useIsTruncated";
import UseIstruncated from "@/lib/hooks/useIstruncated";

interface ActiveMedsProps {
  activeMeds: any[];
  isLoading: boolean;
}

const ActiveMeds: React.FC<ActiveMedsProps> = ({ activeMeds, isLoading }) => {
  console.log(activeMeds, "activemeds");

  return (
    <>
      <div className="sidebar-divider" />
      <div className="flex flex-col">
        {isLoading ? (
          <ActiveMedsLoaders />
        ) : activeMeds.length > 0 ? (
          <div>
            <h1 className="mb-1 font-semibold text-[#4FF4FF]">Active Meds</h1>
            <div className="grid grid-flow-col grid-cols-2 grid-rows-3">
              {activeMeds.map((med, index) => {
                const [isTruncated, textRef] = UseIstruncated();

                return (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger className="text-start">
                        <div
                          className={`col-span-1 grid grid-cols-3 ${
                            activeMeds.length > 3 && index < 3
                              ? "border-r border-gray-300"
                              : ""
                          } `}
                        >
                          <div
                            ref={textRef}
                            className={`col-span-2 truncate ${
                              index > 2 ? "ml-5" : ""
                            }`}
                          >
                            {med.prescriptions_name}
                          </div>
                          <div className="col-span-1">
                            {med.prescriptions_dosage}
                          </div>
                        </div>
                      </TooltipTrigger>
                      {isTruncated ? (
                        <TooltipContent
                          className="z-[45] overflow-visible text-wrap rounded-[2.4px] bg-[#007C85] text-white max-w-[300px] text-[15px]"
                          side="top"
                        >
                          <p>Medication: {med.prescriptions_name}</p>
                          <p>Frequency: {med.prescriptions_frequency}</p>
                          <p>Interval: {med.prescriptions_interval} hours</p>
                          <div className="absolute left-1/2 bottom-[-5px] z-[49] h-3 w-3 -translate-x-1/2 rotate-45 transform bg-[#007C85]"></div>
                        </TooltipContent>
                      ) : (
                        <TooltipContent
                          className="z-[45] overflow-visible text-wrap rounded-[2.4px] bg-[#007C85] text-white text-[15px]"
                          side="top"
                        >
                          <p>Frequency: {med.prescriptions_frequency}</p>
                          <p>Interval: {med.prescriptions_interval} hours</p>
                          <div className="absolute left-1/2 bottom-[-5px] z-[49] h-3 w-3 -translate-x-1/2 rotate-45 transform bg-[#007C85]"></div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        ) : (
          <div>N/A</div>
        )}
      </div>
    </>
  );
};

export default ActiveMeds;
