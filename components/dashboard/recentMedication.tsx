import React from "react";
import ResuableTooltip from "../reusable/tooltip";
import Image from "next/image";
import { DBRecentMedicationProps } from "@/lib/interface";
import Link from "next/link";
import SeeAll from "../reusable/seeAll";

const RecentMedication = ({
  recentMedication,
  isMedicationCollapsed,
  isPRNCollapsed,
  toggleMedicationCollapse,
  patientId,
}: DBRecentMedicationProps) => {
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
          {recentMedication?.map((medication: any, index: number) =>
            extractMedicationName(medication?.medicationlogs_medicationLogsName) !== null ? (
              <div
                key={index}
                className={`sub-title grid w-full grid-cols-3 ${index > 3 ? "pl-5" : ""}`}
              >
                <div className="col-span-2 truncate">
                  <ResuableTooltip
                    text={`${extractMedicationName(medication?.medicationlogs_medicationLogsName)}`}
                  />
                </div>
                <div className="col-span-1 text-start">
                  {extractDosage(medication?.medicationlogs_medicationLogsName)}
                </div>
              </div>
            ) : (
              <div className="sub-title absolute left-[15%] top-[50%] mt-5 h-full w-1/2">
                no data yet
              </div>
            ),
          )}
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
        className="left-[35%]"
      />
    </>
  );
};

export default RecentMedication;
