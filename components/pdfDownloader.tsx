"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import DownloadPDF from "./shared/buttons/downloadpdf";
import { fetchDueMedication } from "@/app/api/medication-logs-api/due-medication-api";
import { useRouter } from "next/navigation";
import { downloadPdf, formatCreatedAtDate, formatCreatedAtTime, formatDate, formatTime } from "@/lib/utils";
import { searchPatientList } from "@/app/api/patients-api/patientList.api";
import { fetchAllAppointments } from "@/app/api/appointments-api/fetch-all-appointments.api";
import { fetchScheduledMedByPatient } from "@/app/api/medication-logs-api/scheduled-med-api";
import { fetchPRNMedByPatient } from "@/app/api/medication-logs-api/prn-med-api";
import { fetchNotesByPatient } from "@/app/api/notes-api/notes-api";
import { DateTime } from 'luxon';
import { fetchVitalSignsByPatient } from "@/app/api/vital-sign-api/vital-sign-api";

const PdfDownloader = ({ props, variant, patientId }: any) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("ASC");

  const handleDownloadPDF = async () => {
    setIsLoading(true);
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
          setIsLoading(false);
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching due medications:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch due medications",
        });
        setIsLoading(false);
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
          setIsLoading(false);
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching due medications:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch due medications",
        });
        setIsLoading(false);
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
          ["Scheduled"],
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
          setIsLoading(false);
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointmentlist:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch appointment list",
        });
        setIsLoading(false);
      }
    }
    if (variant === "Scheduled Medication Table") {
      try {

        const marList = await fetchScheduledMedByPatient(
          patientId,
          "",
          1,
          "medicationLogsDate",
          sortOrder as "ASC" | "DESC",
          0,
          router,
        );

        console.log(marList, "marList");
        if (marList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Scheduled List is empty",
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
          setIsLoading(false);
        } else {
          let jsonFile: {
            Uuid: string;
            Date: string;
            Time: string;
            Medication: string,
            Notes:string,
            Status: string,
          }[] = marList.data.map((d: any) => ({
            Uuid: d.medicationlogs_uuid,
            Date: d.medicationlogs_medicationLogsDate,
            Time: d.medicationlogs_medicationLogsTime,
            Medication: d.medicationlogs_medicationLogsName,
            Notes:d.medicationlogs_notes,
            Status: d.medicationlogs_medicationLogStatus,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching scheduled list:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch scheduled list",
        });
        setIsLoading(false);
      }
    }
    if (variant === "PRN Medication Table") {
      try {

        const marList = await fetchPRNMedByPatient(
          patientId,
          "",
          1,
          "medicationLogsDate",
          sortOrder as "ASC" | "DESC",
          0,
          router,
        );

        console.log(marList, "marList");
        if (marList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "PRN List is empty",
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
          setIsLoading(false);
        } else {
          let jsonFile: {
            Uuid: string;
            Date: string;
            Time: string;
            Medication: string,
            Notes:string,
            Status: string,
          }[] = marList.data.map((d: any) => ({
            Uuid: d.medicationlogs_uuid,
            Date: d.medicationlogs_medicationLogsDate,
            Time: d.medicationlogs_medicationLogsTime,
            Medication: d.medicationlogs_medicationLogsName,
            Notes:d.medicationlogs_notes,
            Status: d.medicationlogs_medicationLogStatus,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching PRN list:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch PRN list",
        });
        setIsLoading(false);
      }
    }
    if (variant === "Nurse's Note Table" || variant === "Incident Report Table") {
      try {
        const type = variant === "Nurse's Note Table" ? "nn" : "ir";
        const notes = await fetchNotesByPatient(
          patientId,
          "",
          type,
          1,
          "createdAt",
          "DESC",
          0,
          router,
        );

        console.log(notes, "notes");
        if (notes.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "notes is empty",
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
          setIsLoading(false);
        } else {
          let jsonFile: { 
            Uuid: string;
            Date: string;
            Time: string;
            Subject: string,
            Notes:string,
          }[] = notes.data.map((d: any) => ({
            Uuid: d.notes_uuid,
            Date: formatCreatedAtDate(d.notes_createdAt),
            Time: formatCreatedAtTime(d.notes_createdAt),
            Subject: d.notes_subject,
            Notes:d.notes_notes,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching notes list:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch notes list",
        });
        setIsLoading(false);
      }
    }
    if (variant === "Vital Sign Table") {
      try {

        const vitalSignList = await fetchVitalSignsByPatient(
          patientId,
          "",
          1,
          "date",
          "DESC",
          0,
          router,
        );

        console.log(vitalSignList, "vitalSignList");
        if (vitalSignList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "vitalSignList is empty",
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
          setIsLoading(false);
        } else {
          let jsonFile: { 
            Uuid: string;
            Date: string;
            Time: string;
            BP: string,
            HR:string,
            Temp: string,
            Resp: string,
          }[] = vitalSignList.data.map((d: any) => ({
            Uuid: d.vitalsign_uuid,
            Date: formatDate(d.vitalsign_date),
            Time: formatTime(d.vitalsign_time),
            BP: d.vitalsign_bloodPressure + "mmHg",
            HR:d.vitalsign_heartRate + "bpm",
            Temp: d.vitalsign_temperature + "°F",
            Resp: d.vitalsign_respiratoryRate +"breaths/min",
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching vitalSignListt:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch vitalSignList",
        });
        setIsLoading(false);
      }
    }
  };

  return (
    <div onClick={handleDownloadPDF}>
      <DownloadPDF isLoading={isLoading}/>
    </div>
  );
};

export default PdfDownloader;
