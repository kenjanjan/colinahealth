"use client";
import React, { useEffect, useRef, useState } from "react";
import DBPatientSelect from "./dbPatientSelect";
import DoughnutChart from "../DoughnutChart";
import { useRouter } from "next/navigation";
import { fetchPatientRecentInfo } from "@/app/api/patients-api/patientRecentInfo.api";
import ResuableTooltip from "../reusable/tooltip";
import { formatDate, formatTime } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
interface DBPatientSummaryProps {
  totalDueMedication: number;
  totalDone: number;
}

const DBPatientSummary = ({
  totalDueMedication,
  totalDone,
}: DBPatientSummaryProps) => {
  const router = useRouter();
  const [patientId, setPatientId] = React.useState("");
  const [halfWidth, setHalfWidth] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const [patientRecentInfo, setPatientRecentInfo] = useState<any>();
  const [recentMedication, setRecentMedication] = useState<any>();
  const [isMedicationCollapsed, setIsMedicationCollapsed] = useState(false);
  const [isPRNCollapsed, setIsPRNCollapsed] = useState(false);

  const toggleMedicationCollapse = () => {
    setIsMedicationCollapsed((prevState) => !prevState);
  };

  let filteredMedication;

  if (recentMedication === undefined) {
    filteredMedication = [];
  } else {
    filteredMedication = isMedicationCollapsed
      ? recentMedication
      : recentMedication.slice(0, 4);
  }

  const togglePRNCollapse = () => {
    setIsPRNCollapsed((prevState) => !prevState);
  };

  const pri = patientRecentInfo!;
  const totalPatientDue =
    pri === undefined ? 0 : pri?.totalMedicationDue?.medicationCount;
  const totalPatientDone =
    pri === undefined ? 0 : pri?.totalMedicationDone?.medicationCount;

  const allergens = pri?.patientAllergies[0]?.allergens
    ? pri.patientAllergies[0].allergens
        .split(",")
        .map((allergen: string) => allergen.trim())
    : ["No Allergens"];
  console.log("totalPatientDue", totalPatientDue);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPatientRecentInfo(patientId, router);
        setPatientRecentInfo(response.data);
        setRecentMedication(response.data.recentMedication);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchData();
  }, [patientId]);
  useEffect(() => {
    if (parentRef.current) {
      const parentWidth = parentRef.current.offsetWidth;
      setHalfWidth(parentWidth / 2);
    }
  }, []);
  console.log("patientId", patientId);
  console.log(patientRecentInfo, "patientRecentInfo");
  console.log("recentMedication", recentMedication);

  function extractDosage(medicationString: string) {
    const dosagePattern = /\b\d+(mg|g|mcg|ml|units)\b/i;
    const match = medicationString.match(dosagePattern);
    return match ? match[0] : null;
  }

  function extractMedicationName(medicationString: string) {
    const dosagePattern = /\b\d+(mg|g|mcg|ml|units)\b/i;
    const match = medicationString.match(dosagePattern);
    if (match) {
      const dosageIndex = match.index; // Index where dosage starts
      return medicationString.substring(0, dosageIndex).trim();
    }
    return medicationString.trim(); // If no dosage found, return the whole string
  }
  return (
    <div
      className="flex h-full w-full flex-col justify-between gap-3"
      ref={parentRef}
    >
      <div className="flex h-[50px] w-1/2 pr-[6px]">
        <DBPatientSelect
          patientId={patientId}
          setPatientId={setPatientId}
          width={halfWidth}
        />
      </div>

      <div className="h-full w-full">
        <div className="grid h-4/6 w-full grid-cols-2 grid-rows-2 gap-4">
          <div className="relative h-full overflow-hidden rounded-[5px] bg-[#D9D9D91A]">
            <div className="bg-[#F4E394] p-6" />
            <div className="relative h-full w-full px-5 py-3">
              <div className="flex h-full w-full flex-col gap-0.5">
                <h1 className="font-medium">Patient Details</h1>
                {pri == undefined ? (
                  <div className="sub-title absolute inset-0 -mt-5 flex h-full w-full items-center justify-center">
                    no data yet
                  </div>
                ) : (
                  <div className="sub-title flex flex-col gap-0.5">
                    <div className="grid w-full grid-cols-3">
                      <div className="col-span-1 grid">Name: </div>
                      <div className="col-span-2 grid">
                        <div className="flex">
                          <div className="max-w-[57.5%] truncate">
                            <ResuableTooltip
                              text={`${pri?.data[0]?.patient_firstName}${" "}
                            ${pri?.data[0]?.patient_middleName}${" "}
                          ${pri?.data[0]?.patient_lastName} ${" "}`}
                            />{" "}
                          </div>
                          <div className="w-3/6">
                            {" "}
                            <span className="ml-1"> - </span>
                            {pri?.data[0]?.patient_age}{" "}
                            {pri?.data[0]?.patient_gender}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3">
                      <div className="col-span-1 grid">Date of Birth: </div>
                      <div className="col-span-2 grid">
                        {formatDate(pri?.data[0]?.patient_dateOfBirth)}
                      </div>
                    </div>
                    <div className="grid grid-cols-3">
                      <div className="col-span-1 grid">Address: </div>
                      <div className="col-span-2 grid">
                        <div className="w-full truncate">
                          <ResuableTooltip
                            text={`${pri?.data[0]?.patient_address1}`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3">
                      <div className="col-span-1 grid">Phone Number:</div>
                      <div className="col-span-2 grid">
                        {pri?.data[0]?.patient_phoneNo}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Link href={"/"}>
              <div className="sub-title absolute bottom-3 right-5 flex">
                See All
                <Image
                  src="/icons/see-all-icon.svg"
                  alt="dropdown"
                  width={17}
                  height={14}
                />
              </div>
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-[5px] bg-[#D9D9D91A]">
            <div className="bg-[#F3BB93] p-6" />
            <div className="px-5 py-3">
              <h1 className="mb-[2px] flex items-center justify-between font-medium">
                Vital Signs{" "}
                <p className="sub-title">
                  {formatDate(pri?.data[0]?.vsdate)} -{" "}
                  {formatTime(pri?.data[0]?.vstime)}
                </p>
              </h1>

              <div className="sub-title grid grid-cols-3 gap-0.5">
                <div className="col-span-1">Blood Pressure:</div>
                <div className="col-span-2">
                  {pri?.data[0]?.bloodPressure}
                  {pri?.data[0]?.bloodPressure == "No Blood Pressure"
                    ? ""
                    : "mmHg"}
                </div>
                <div className="col-span-1">Heart Rate:</div>
                <div className="col-span-2">
                  {pri?.data[0]?.heartRate}{" "}
                  {pri?.data[0]?.heartRate == "No Heart Rate" ? "" : "bpm"}
                </div>
                <div className="col-span-1">Temperature:</div>
                <div className="col-span-2">
                  {pri?.data[0]?.temperature}
                  {pri?.data[0]?.temperature == "No Temperature" ? "" : "°F"}
                </div>
                <div className="col-span-1">Respiratory:</div>
                <div className="col-span-2">
                  {pri?.data[0]?.respiratoryRate}{" "}
                  {pri?.data[0]?.respiratoryRate == "No Respiratory Rate"
                    ? ""
                    : "breaths per minute"}
                </div>
              </div>
            </div>
            <Link href={"/"}>
              <div className="sub-title absolute bottom-3 right-5 flex">
                See All
                <Image
                  src="/icons/see-all-icon.svg"
                  alt="dropdown"
                  width={17}
                  height={14}
                />
              </div>
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-[5px] bg-[#D9D9D91A]">
            <div className="bg-[#93F3B9] p-6" />
            <div className="px-5 py-3">
              <div className="absolute right-[50%] h-[68%] w-[1px] bg-[#DDDDDD]"></div>
              <div className="grid w-full grid-cols-2">
                <div
                  className={`col-span-1 flex w-full flex-col pr-4 transition-all duration-300 ${isPRNCollapsed ? "-translate-x-[100%]" : ""}`}
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
                <div
                  className={`absolute flex w-1/2 flex-col bg-[#D9D9D9A] pl-10 transition-all duration-300 ${isMedicationCollapsed ? "translate-x-[100%]" : ""} ${isPRNCollapsed ? "right-[53%]" : "right-5"}`}
                >
                  <div className="flex w-full justify-between">
                    <div className="font-medium">PRN</div>
                    <div className="flex justify-end text-end">
                      <Image
                        onClick={togglePRNCollapse}
                        className={`${isPRNCollapsed ? "-rotate-90" : "rotate-90"} cursor-pointer transition-all duration-300`}
                        src="/icons/see-all-icon.svg"
                        alt="dropdown"
                        width={17}
                        height={14}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`grid grid-flow-col grid-cols-2 grid-rows-4 transition-all duration-300 ${isPRNCollapsed ? "-translate-x-[300px]" : ""}`}
              >
                {filteredMedication?.map((medication: any, index: number) => (
                  <div className={`sub-title grid w-full grid-cols-6 gap-6 ${index>3?"pl-5":""}`}>
                    <div className="col-span-4 truncate">
                      <ResuableTooltip
                        text={`${extractMedicationName(
                          medication?.medicationlogs_medicationLogsName,
                        )}`}
                      />
                    </div>
                    <div className="col-span-2 text-start">
                      {extractDosage(
                        medication?.medicationlogs_medicationLogsName,
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className={`absolute top-[36%] grid w-full grid-flow-col grid-cols-2 grid-rows-4 pl-[10px] transition-all duration-300 ${isMedicationCollapsed ? "translate-x-[100%]" : isPRNCollapsed ? "-translate-x-[1.3%]" : "translate-x-[48%]"} `}
              >
                {filteredMedication?.map((medication: any, index: number) => (
                  <div className="sub-title grid w-full grid-cols-6 gap-6">
                    <div className="col-span-4 truncate">
                      <ResuableTooltip
                        text={`${extractMedicationName(
                          medication?.medicationlogs_medicationLogsName,
                        )}`}
                      />
                    </div>
                    <div className="col-span-2 text-start">
                      {extractDosage(
                        medication?.medicationlogs_medicationLogsName,
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[5px] bg-[#D9D9D91A]">
            <div className="bg-[#93F3DC] p-6" />
            <div className="px-5 py-3">4</div>
          </div>
        </div>
        <div className="relative mt-4 h-2/6 w-full overflow-hidden rounded-[5px] bg-[#D9D9D91A]">
          <div className="bg-[#93D0F3] p-6" />
          <div className="grid grid-cols-2">
            <div>1</div>
            <div>2</div>
          </div>
        </div>
      </div>

      {/* <div className="w-full h-full gap-3 flex flex-col">
        <div className="h-4/6 w-full gap-3">
          <div className="h-1/2 w-full flex   gap-3 relative">
            <div className="h-full bg-[#D9D9D91A] max-w-1/2 w-1/2 ">
              <div className="h-[40px] rounded-t-[5px] bg-[#F4E394] w-full"></div>
              <div className="pt-2 pb-5 px-5 relative h-full w-full">
                <h1 className="text-[15px] font-medium">Patient Details</h1>
                <div className="flex items-center mt-2 sub-title ">
                  {pri == undefined ? (
                    <h1 className="text-center w-full">no data yet</h1>
                  ) : (
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex w-full truncate">
                        Name:{" "}
                        <div className="w-full ">
                          <p className=" truncate w-full flex">
                            <ResuableTooltip
                              text={`${pri?.data[0]?.patient_firstName}${" "}
                            ${pri?.data[0]?.patient_middleName}${" "}
                          ${pri?.data[0]?.patient_lastName} ${" "}`}
                            />
                             {" "}
                            - {pri?.data[0]?.patient_age}{" "}
                            {pri?.data[0]?.patient_gender}
                          </p>
                      
                        </div>
                      </div>
                      <h1>
                        Date of Birth:{" "}
                        {formatDate(pri?.data[0]?.patient_dateOfBirth)}
                      </h1>
                      <div className="w-full  flex ">
                        Address:{" "}
                        <h1 className="w-[420px] truncate">
                          <ResuableTooltip
                            text={`${pri?.data[0]?.patient_address1}`}
                          />
                        </h1>
                      </div>
                      <h1>Phone Number: {pri?.data[0]?.patient_phoneNo}</h1>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="h-full bg-[#D9D9D91A] relative w-1/2">
              <div className="h-[40px] rounded-t-[5px] bg-[#F3BB93] w-full"></div>
              <div className="pt-2 pb-5 px-5 relative">
                <h1 className="text-[15px] font-medium ">Vital Signs</h1>
                <div className="h-full w-full flex items-center mt-2 sub-title ">
                  {pri == undefined ? (
                    <h1 className="text-center w-full">no data yet</h1>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <h1>Blood Pressure: {pri?.data[0]?.bloodPressure}{pri?.data[0]?.bloodPressure == "No Blood Pressure"?"" :"mmHg"}</h1>
                      <h1>Heart Rate: {pri?.data[0]?.heartRate}{" "}{pri?.data[0]?.heartRate == "No Heart Rate"?"":"bpm"}</h1>
                      <h1>Temperature: {pri?.data[0]?.temperature}{pri?.data[0]?.temperature== "No Temperature"?"":"°F"}</h1>
                      <h1>Respiratory: {pri?.data[0]?.respiratoryRate}{" "}{pri?.data[0]?.respiratoryRate == "No Respiratory Rate"?"":"breaths per minute"}</h1>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="h-[200px] w-full flex flex-row gap-3">
            <div className="h-full bg-[#D9D9D91A] w-1/2">
              <div className="h-[40px] rounded-t-[5px] bg-[#93F3B9] w-full"></div>
              <div className="pt-2 pb-5  px-5">
                <h1 className="text-[15px] font-medium ">Medication</h1>
                <div className="h-full w-full flex items-center sub-title mt-2">
                  {pri == undefined ? (
                    <h1 className="text-center w-full">no data yet</h1>
                  ) : recentMedication === undefined ? (
                    <div>No Recent Medication</div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <p>{recentMedication} {recentMedicationType=="PRN" && "- PRN" }</p>
                      <p>Date Taken : {" "} {formatDate(recentMedicationDate)}</p>
                      <p>Time Taken : {" "} {formatTime(recentMedicationTime)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="h-full bg-[#D9D9D91A] w-1/2">
              <div className="h-[40px] rounded-t-[5px] bg-[#93F3DC] w-full"></div>
              <div className="pt-2 pb-5  pl-5">
                <h1 className="text-[15px] font-medium">Allergies</h1>
                <div className="h-full w-full flex items-center sub-title">
                  {pri == undefined ? (
                    <h1 className="text-center w-full">no data yet</h1>
                  ) : (
                    <div className="max-h-[100px] w-full overflow-auto">
                      <div className="h-full mt-2 flex flex-col gap-1">
                        {allergens.map(
                          (
                            allergen:
                              | string
                              | number
                              | boolean
                              | React.ReactElement<
                                  any,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | React.PromiseLikeOfReactNode
                              | null
                              | undefined,
                            index: React.Key | null | undefined
                          ) => (
                            <div key={index}>{allergen}</div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="h-2/4 bg-[#D9D9D91A] ">
          <div className="h-[40px] rounded-t-[5px] bg-[#93D0F3] w-full"></div>
          <div className="pt-5 px-5">
            <div className="flex gap-3 w-full relative">
              <div className="w-1/2 relative">
                <h1 className="absolute text-[15px] font-medium  truncate w-full">
                  {pri === undefined
                    ? "[Patient Name]"
                    : pri?.data[0]?.patient_firstName+"'s"}{" "}
                  Due Medication
                </h1>
                <div className="h-full w-full flex  items-center justify-center ">
                  <DoughnutChart
                    total={totalPatientDue}
                    totalDone={totalPatientDone}
                  />
                </div>
              </div>
              <div className=" w-[1px]  bg-[#DDDDDD]"></div>
              <div className="w-1/2 relative">
                <h1 className="absolute text-[15px] font-medium ">
                  Total Due Meds of All Patients
                </h1>
                <div className="h-full w-full flex  items-center justify-center ">
                  <DoughnutChart
                    total={totalDueMedication}
                    totalDone={totalDone}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DBPatientSummary;
