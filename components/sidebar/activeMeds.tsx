import React from "react";
import ResuableTooltip from "../reusable/tooltip";
import ActiveMedsLoaders from "./loaders/activeMedsLoaders";

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
              {activeMeds.map((med, index) => (
                <div
                  key={index}
                  className={`col-span-1 grid grid-cols-3 ${
                    activeMeds.length > 3 && index < 3
                      ? "border-r border-gray-300"
                      : ""
                  } `}
                >
                  <div
                    className={`col-span-2 truncate ${index > 2 ? "ml-5" : ""}`}
                  >
                    <ResuableTooltip text={`${med.prescriptions_name}`} />
                  </div>
                  <div className="col-span-1">{med.prescriptions_dosage}</div>
                </div>
              ))}
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
