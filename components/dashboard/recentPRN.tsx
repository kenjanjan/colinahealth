import React from "react";
import ResuableTooltip from "../reusable/tooltip";
import Image from "next/image";
import { DBRecentPRNProps } from "@/lib/interface";
import Link from "next/link";

const RecentPRN = ({
  recentPRN,
  isMedicationCollapsed,
  isPRNCollapsed,
  togglePRNCollapse,
}: DBRecentPRNProps) => {
  function extractDosage(
    medicationString: string | null | undefined,
  ): string | null {
    if (!medicationString) {
      return null;
    }

    const dosagePattern = /\b\d+(mg|g|mcg|ml|units)\b/i;
    const match = medicationString.match(dosagePattern);
    return match ? match[0] : null;
  }

  function extractMedicationName(
    medicationString: string | null | undefined,
  ): string | null {
    if (!medicationString) {
      return null;
    }

    const dosagePattern = /\b\d+(mg|g|mcg|ml|units)\b/i;
    const match = medicationString.match(dosagePattern);
    if (match) {
      const dosageIndex = match.index; // Index where dosage starts
      return medicationString.substring(0, dosageIndex).trim();
    }
    return medicationString.trim(); // If no dosage found, return the whole string
  }
  console.log(recentPRN, "recentPRN");
  return (
    <div
      className={`${isMedicationCollapsed ? "translate-x-[100%]" : isPRNCollapsed ? "" : "translate-x-[50%]"} absolute top-[55px] h-full w-full bg-[#FAFAFA] pr-5 transition-all duration-300`}
    >
      <div className="relative grid w-full grid-cols-2">
        <div
          className={`col-span-1 flex w-full flex-col pr-4 transition-all duration-300`}
        >
          <div className="flex w-full justify-between">
            <div className="font-medium">PRN</div>
            <div className="flex justify-end text-end">
              <Image
                onClick={togglePRNCollapse}
                className={`${isPRNCollapsed ? "-rotate-90" : "rotate-90"} mr-2 cursor-pointer transition-all duration-300`}
                src="/icons/see-all-icon.svg"
                alt="dropdown"
                width={17}
                height={14}
              />
            </div>
          </div>
        </div>
      </div>
      {recentPRN ? (
        <div className="relative grid grid-flow-col grid-cols-2 grid-rows-4 transition-all duration-300">
          {recentPRN.map((medication: any, index: number) =>
            extractMedicationName(
              medication?.medicationlogs_medicationLogsName,
            ) !== null ? (
              <div
                key={index}
                className={`sub-title grid w-full grid-cols-6 gap-6 ${index > 3 ? "pl-5" : ""}`}
              >
                <div className="col-span-4 truncate">
                  <ResuableTooltip
                    text={`${extractMedicationName(medication?.medicationlogs_medicationLogsName)}`}
                  />
                </div>
                <div className="col-span-2 text-start">
                  {extractDosage(medication?.medicationlogs_medicationLogsName)}
                </div>
              </div>
            ) : (
              <div className="sub-title absolute right-[35%] top-[50px]  h-full w-1/2">
                no data yet
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="sub-title absolute right-[35%] top-[50px] mt-5 h-full w-1/2">
          no data yet
        </div>
      )}
    </div>
  );
};

export default RecentPRN;
