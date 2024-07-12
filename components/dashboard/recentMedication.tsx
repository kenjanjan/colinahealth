import React from "react";
import ResuableTooltip from "../reusable/tooltip";
import Image from "next/image";
import { DBRecentMedicationProps } from "@/lib/interface";
import Link from "next/link";
import SeeAll from "../reusable/seeAll";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UseIsTruncated from "@/lib/hooks/useIstruncated";
import { formatDate, formatTime } from "@/lib/utils";

const RecentMedication = ({
  recentMedication,
  isMedicationCollapsed,
  isPRNCollapsed,
  toggleMedicationCollapse,
  patientId,
}: DBRecentMedicationProps) => {
  const [isTruncated, textRef] = UseIsTruncated();
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
  console.log(recentMedication, "recentMedication");
  return (
    <>
      <div className="grid w-full grid-cols-2 bg-[#FAFAFA]">
        <div
          className={`col-span-1 flex w-full flex-col pr-4 transition-all duration-300`}
        >
          <div className="flex w-full justify-between">
            <div className="font-medium">Medication</div>
            <div className="flex justify-end text-end">
              <Image
                onClick={toggleMedicationCollapse}
                className={`${isMedicationCollapsed ? "-rotate-90" : "rotate-90"} cursor-pointer transition-all duration-300`}
                src="/icons/see-all-icon.svg"
                alt="dropdown"
                width={17}
                height={14}
              />
            </div>
          </div>
        </div>
      </div>

      {recentMedication ? (
        <div
          className={`grid grid-flow-col grid-cols-2 grid-rows-4 transition-all duration-300`}
        >
          {recentMedication?.map((medication: any, index: number) => {
            return extractMedicationName(
              medication?.medicationlogs_medicationLogsName,
            ) !== null ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-start">
                    <div
                      key={index}
                      className={`sub-title grid w-full grid-cols-3 ${index > 3 ? "pl-5" : ""}`}
                    >
                      <div className="col-span-2 truncate pr-5" ref={textRef}>
                        {extractMedicationName(
                          medication?.medicationlogs_medicationLogsName,
                        )}
                      </div>
                      <div className="col-span-1 text-start">
                        {extractDosage(
                          medication?.medicationlogs_medicationLogsName,
                        )}
                      </div>
                    </div>
                  </TooltipTrigger>

                  {isTruncated ? (
                    <TooltipContent
                      className="z-[45] max-w-[300px] overflow-visible text-wrap rounded-[2.4px] bg-[#007C85] text-[15px] text-white"
                      side="top"
                    >
                      <p>
                        Medication:{" "}
                        {medication.medicationlogs_medicationLogsName}
                      </p>
                      <p>
                        Date Taken:{" "}
                        {formatDate(
                          medication.medicationlogs_medicationLogsDate,
                        )}
                      </p>
                      <p>
                        Time Taken:{" "}
                        {formatTime(
                          medication.medicationlogs_medicationLogsTime,
                        )}
                      </p>
                      <div className="absolute bottom-[-5px] left-1/2 z-[49] h-3 w-3 -translate-x-1/2 rotate-45 transform bg-[#007C85]"></div>
                    </TooltipContent>
                  ) : (
                    <TooltipContent
                      className="z-[45] overflow-visible text-wrap rounded-[2.4px] bg-[#007C85] text-[15px] text-white"
                      side="top"
                    >
                      <p>
                        Date Taken:{" "}
                        {formatDate(
                          medication.medicationlogs_medicationLogsDate,
                        )}
                      </p>
                      <p>
                        Time Taken:{" "}
                        {formatTime(
                          medication.medicationlogs_medicationLogsTime,
                        )}
                      </p>
                      <div className="absolute bottom-[-5px] left-1/2 z-[49] h-3 w-3 -translate-x-1/2 rotate-45 transform bg-[#007C85]"></div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="sub-title absolute left-[15%] top-[50%] mt-5 h-full w-1/2">
                no data yet
              </div>
            );
          })}
        </div>
      ) : (
        <div className="sub-title absolute left-[15%] top-[50%] mt-5 h-full w-1/2">
          no data yet
        </div>
      )}
      <SeeAll
        url={
          patientId ? `/patient-overview/${patientId}/medication/scheduled` : ""
        }
        className={`transition-all duration-300 ${isMedicationCollapsed ? "left-[85%]" : "left-[35%]"}`}
      />
    </>
  );
};

export default RecentMedication;
