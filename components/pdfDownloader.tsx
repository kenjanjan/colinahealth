"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import DownloadPDF from "./shared/buttons/downloadpdf";
import { fetchDueMedication } from "@/app/api/medication-logs-api/due-medication-api";
import { useRouter } from "next/navigation";
import { downloadPdf } from "@/lib/utils";
import { searchPatientList } from "@/app/api/patients-api/patientList.api";
import { fetchAllAppointments } from "@/app/api/appointments-api/fetch-all-appointments.api";

const PdfDownloader = ({ props, variant }: any) => {
  const router = useRouter();
  const [sortOrder, setSortOrder] = useState("ASC");

  const handleDownloadPDF = async () => {
    if (variant === "Due Medication Table") {
      try {
        const dueMedicationList = await fetchDueMedication(
          "",
          1,
          "medicationlogs.medicationLogsTime",
          sortOrder as "ASC" | "DESC",
          0,
          router,
        );

        if (dueMedicationList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Due Med is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
        } else {
          let jsonFile: {
            Name: string;
            Uuid: string;
            Medication: string;
            Date: string;
            Time: string;
          }[] = dueMedicationList.data.map((d: any) => ({
            Name: d.patient_firstName + " " + d.patient_lastName,
            Uuid: d.medicationlogs_uuid,
            Medication: d.medicationlogs_medicationLogsName,
            Date: d.medicationlogs_medicationLogsDate,
            Time: d.medicationlogs_medicationLogsTime,
          }));

          downloadPdf(jsonFile, props, variant);
        }
      } catch (error) {
        console.error("Error fetching due medications:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch due medications",
        });
      }
    }
    if (variant === "Patient List Table") {
      try {
        const patientList = await searchPatientList(
          "",
          1,
          "firstName",
          sortOrder as "ASC" | "DESC",
          0,
          router,
        );

        console.log(patientList, "patientList");
        if (patientList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Patient List is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
        } else {
          let jsonFile: {
            Uuid: string;
            Name: string;
            Age: string;
            Gender: string;
          }[] = patientList.data.map((d: any) => ({
            Uuid: d.uuid,
            Name: d.firstName + " " + d.lastName,
            Age: d.age,
            Gender: d.gender,
          }));

          downloadPdf(jsonFile, props, variant);
        }
      } catch (error) {
        console.error("Error fetching due medications:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch due medications",
        });
      }
    }
    if (variant === "Appointment List Table") {
      try {
        const startD = "2021-01-01";
        const endD = "2300-01-01";
        const appointmentList = await fetchAllAppointments(
          "",
          1,
          "time",
          sortOrder as "ASC" | "DESC",
          startD,
          endD,
          0,
          router,
        );

        console.log(appointmentList, "appointmentList");
        if (appointmentList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Appointment List is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
        } else {
          let jsonFile: {
            Name: string;
            Uuid: string;
            Date: string;
            Start_Time: any;
            End_Time: any,
            Status: string,
          }[] = appointmentList.data.map((d: any) => ({
            Name: d.patient_firstName + " " + d.patient_lastName,
            Uuid: d.appointments_uuid,
            Date: d.appointments_appointmentDate,
            Start_Time: d.appointments_appointmentTime,
            End_Time: d.appointments_appointmentEndTime,
            Status: d.appointments_appointmentStatus,
          }));

          downloadPdf(jsonFile, props, variant);
        }
      } catch (error) {
        console.error("Error fetching appointmentlist:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch appointment list",
        });
      }
    }
  };

  return (
    <div onClick={handleDownloadPDF}>
      <DownloadPDF />
    </div>
  );
};

export default PdfDownloader;
