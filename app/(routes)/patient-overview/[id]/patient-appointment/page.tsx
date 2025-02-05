"use client";
import Image from "next/image";

import React, { useEffect } from "react";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import View from "@/components/shared/buttons/view";
import { useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter } from "next/navigation";
import { fetchAppointmentsByPatient as fetchAppointmentsByPatient } from "@/app/api/appointments-api/appointments.api";
import { AppointmentviewModalContent } from "@/components/modal-content/appointmentview-modal-content";
import Modal from "@/components/reusable/modal";
import { AppointmentModalContent } from "@/components/modal-content/appointment-modal-content";
import { ClipboardList } from "lucide-react";
import { AppointmentemailModalContent } from "@/components/modal-content/appointmentemail-modal-content";
import { SuccessModal } from "@/components/shared/success";
import { ErrorModal } from "@/components/shared/error";
import Pagination from "@/components/shared/pagination";
import ResuableTooltip from "@/components/reusable/tooltip";
const Appointment = () => {
  const router = useRouter();
  if (typeof window === "undefined") {
  }
  // start of orderby & sortby function
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEdit, setIsView] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const formatDate = (createdAt: string | number | Date) => {
    // Create a new Date object from the provided createdAt date string
    const date = new Date(createdAt);

    // Get the month, day, and year
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate;
  };
  const formatTime = (timeString: string) => {
    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(":").map(Number);

    // Format the hours part into 12-hour format
    let formattedHours = hours % 12 || 12; // Convert 0 to 12
    const ampm = hours < 12 ? "am" : "pm"; // Determine if it's AM or PM

    // If minutes is undefined or null, set it to 0
    const formattedMinutes =
      minutes !== undefined ? minutes.toString().padStart(2, "0") : "00";

    // Return the formatted time string
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };
  const [error, setError] = useState<string | null>(null);
  const handleGoToPage = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pageNumberInt = parseInt(pageNumber, 10);

    // Check if pageNumber is a valid number and greater than 0
    if (
      !isNaN(pageNumberInt) &&
      pageNumberInt <= totalPages &&
      pageNumberInt > 0
    ) {
      setCurrentPage(pageNumberInt);

      console.log("Navigate to page:", pageNumberInt);
    } else {
      setGotoError(true);
      setTimeout(() => {
        setGotoError(false);
      }, 3000);
      console.error("Invalid page number:", pageNumber);
    }
  };
  const [appointmentData, setAppointmentData] = useState<any[]>([]);

  const [patientAppointments, setPatientAppointments] = useState<any[]>([]);
  const [term, setTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [sortBy, setSortBy] = useState("appointmentDate");
  const [pageNumber, setPageNumber] = useState("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle going to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(e.target.value);
  };
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const patientId = params.id.toUpperCase();

  const handleSortOptionClick = (option: string) => {
    setIsOpenSortedBy(false);
    if (option === "Date") {
      setSortBy("appointmentDate");
    } else if (option === "Time") {
      setSortBy("appointmentTime");
    } else {
      setSortBy("appointmentStatus");
    }
    console.log("option", option);
  };
  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Date", onClick: handleSortOptionClick },
    { label: "Time", onClick: handleSortOptionClick },
    { label: "Status", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function
  const [gotoError, setGotoError] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenReminder, setIsOpenReminder] = useState(false);
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`flex w-[49px] items-center justify-center ring-1 ring-gray-300 ${
            currentPage === i ? "btn-pagination" : ""
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>,
      );
    }
    return pageNumbers;
  };
  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setIsView(false);
      setAppointmentData([]);
    }
  };

  const isModalReminderOpen = (isOpen: boolean) => {
    setIsOpenReminder(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setIsView(false);
      setAppointmentData([]);
    }
  };

  const onSuccess = () => {
    setIsSuccessOpen(true);
  };
  const onFailed = () => {
    setIsErrorOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAppointmentsByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          router,
        );

        //convert date to ISO string

        setPatientAppointments(response.data);
        console.log("Patient list after setting state:", response.data);
        setTotalPages(response.totalPages);
        setTotalAppointments(response.totalCount);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortOrder, sortBy, term, isOpen]);
  if (isLoading) {
    return (
      <div className="container flex h-full w-full items-center justify-center">
        <Image
          src="/imgs/colina-logo-animation.gif"
          alt="logo"
          width={100}
          height={100}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="h-full w-full">
        <div className="mb-2 flex w-full justify-between">
          <div className="flex-row">
            <p className="p-table-title">Appointment</p>

            <div>
              <p className="h-[22px] w-[1157px] text-[15px] font-normal text-[#64748B]">
                Total of {totalAppointments} Appointments
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => isModalOpen(true)} className="btn-add gap-2">
              <Image src="/imgs/add.svg" alt="" width={22} height={22} />
              <p className="text-[18px]">Add</p>
            </button>
            <button
              onClick={() => isModalReminderOpen(true)}
              className="btn-pdfs gap-2"
            >
              <ClipboardList width={22} height={22} />
              <p className="text-[18px]">Reminder</p>
            </button>
          </div>
        </div>

        <div className="m:rounded-lg w-full items-center">
          <div className="flex h-[75px] w-full items-center justify-between bg-[#F4F4F4]">
            <form className="relative mr-5">
              {/* search bar */}
              <label className=""></label>
              <div className="flex">
                <input
                  className="relative m-5 h-[47px] w-[573px] rounded bg-[#fff] bg-no-repeat px-5 py-3 pl-10 pt-[15px] text-[15px] outline-none ring-[1px] ring-[#E7EAEE]"
                  type="text"
                  placeholder="Search by reference no. or name..."
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Image
                  src="/svgs/search.svg"
                  alt="Search"
                  width={20}
                  height={20}
                  className="pointer-events-none absolute left-8 top-9"
                />
              </div>
            </form>

            <div className="mr-3 flex w-full items-center justify-end gap-[12px]">
              <p className="text-[15px] font-semibold text-[#191D23] opacity-[60%]">
                Order by
              </p>
              <DropdownMenu
                options={optionsOrderedBy.map(({ label, onClick }) => ({
                  label,
                  onClick: () => {
                    onClick(label);
                  },
                }))}
                open={isOpenOrderedBy}
                width={"165px"}
                label={"Select"}
              />
              <p className="text-[15px] font-semibold text-[#191D23] opacity-[60%]">
                Sort by
              </p>
              <DropdownMenu
                options={optionsSortBy.map(({ label, onClick }) => ({
                  label,
                  onClick: () => {
                    onClick(label);
                    console.log("label", label);
                  },
                }))}
                open={isOpenSortedBy}
                width={"165px"}
                label={"Select"}
              />
            </div>
          </div>
        </div>
        {/* START OF TABLE */}
        <div>
          <table className="text-left rtl:text-right">
            <thead>
              <tr className="h-[70px] border-y text-[15px] font-semibold uppercase text-[#64748B]">
                <td className="px-6 py-3">STATUS</td>
                <td className="px-6 py-3">DATE</td>
                <td className="px-6 py-3">TIME</td>
                <td className="px-6 py-3">END TIME</td>
                <td className="px-6 py-3">DETAILS</td>
                <td className="px-6 py-3 text-center">ACTION</td>
                <td className="w-[14px]"></td>
              </tr>
            </thead>
            <tbody className="h-[220px] overflow-y-scroll">
              {patientAppointments.length === 0 && (
                <tr>
                  <td className="border-1 absolute flex w-[180vh] items-center justify-center py-5">
                    <p className="text-center text-[15px] font-normal text-gray-700">
                      No Appointment/s <br />
                    </p>
                  </td>
                </tr>
              )}
              {patientAppointments.length > 0 && (
                <>
                  {patientAppointments.map((appointments, index) => (
                    <tr
                      key={index}
                      className="group border-b odd:bg-white even:bg-gray-50 hover:bg-[#f4f4f4]"
                    >
                      <td className="flex items-center rounded-full px-6 py-3 text-[15px]">
                        <div
                          className={`relative flex items-center rounded-[20px] px-2 font-semibold ${
                            appointments.appointments_appointmentStatus ===
                            "Scheduled"
                              ? "bg-[#E7EAEE] text-[15px] text-[#71717A]" // Green color for Scheduled
                              : appointments.appointments_appointmentStatus ===
                                  "Done"
                                ? "bg-[#CCFFDD] text-[15px] text-[#17C653]" // Dark color for Done
                                : appointments.appointments_appointmentStatus ===
                                      "Patient-IN" ||
                                    appointments.appointments_appointmentStatus ===
                                      "On-going"
                                  ? "bg-[#FFF8DD] text-[15px] text-[#F6C000]" // Yellow for On Going
                                  : appointments.appointments_appointmentStatus ===
                                        "Missed" ||
                                      appointments.appointments_appointmentStatus ===
                                        "Cancelled"
                                    ? "bg-[#FFE8EC] text-[15px] text-[#EF4C6A]" // Red color for Missed and Cancelled
                                    : ""
                          }`}
                        >
                          <span
                            className={`mr-1 inline-block h-2 w-2 rounded-full ${
                              appointments.appointments_appointmentStatus ===
                              "Scheduled"
                                ? "bg-[#7E7E7E]" // Green color for Scheduled
                                : appointments.appointments_appointmentStatus ===
                                    "Done"
                                  ? "bg-[#0EB146]" // Dark color for Done
                                  : appointments.appointments_appointmentStatus ===
                                        "Patient-IN" ||
                                      appointments.appointments_appointmentStatus ===
                                        "On-going"
                                    ? "bg-[#E4B90E]" // Yellow for On Going
                                    : appointments.appointments_appointmentStatus ===
                                          "Missed" ||
                                        appointments.appointments_appointmentStatus ===
                                          "Cancelled"
                                      ? "bg-[#EE4D4D]" // Red color for Missed and Cancelled
                                      : ""
                            }`}
                          ></span>
                          {appointments.appointments_appointmentStatus}
                        </div>
                      </td>

                      <td className="px-6 py-3 text-[15px]">
                        {appointments.appointments_appointmentDate}
                      </td>
                      <td className="px-6 py-3 text-[15px]">
                        {formatTime(appointments.appointments_appointmentTime)}
                      </td>
                      <td className="px-6 py-3 text-[15px]">
                        {formatTime(
                          appointments.appointments_appointmentEndTime,
                        )}
                      </td>
                      <td className="px-6 py-3 text-[15px]">
                        <ResuableTooltip
                          text={appointments.appointments_details}
                        />
                      </td>
                      <td className="flex justify-center px-6 py-3">
                        <p
                          onClick={() => {
                            isModalOpen(true);
                            setIsView(true);
                            setAppointmentData(appointments);
                          }}
                        >
                          <View></View>
                        </p>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        {/* END OF TABLE */}
      </div>
      {/* pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        setCurrentPage={setCurrentPage}
      />
      {isOpen && (
        <Modal
          content={
            <AppointmentModalContent
              isModalOpen={isModalOpen}
              onSuccess={onSuccess}
              isOpen={isOpen}
              isView={isEdit}
              appointmentData={appointmentData}
              label="sample label"
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
      {isOpenReminder && (
        <Modal
          content={
            <AppointmentemailModalContent
              onSuccess={onSuccess}
              onFailed={onFailed}
              isModalOpen={isModalReminderOpen}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}

      {isSuccessOpen && (
        <SuccessModal
          label="Email Sent Succesfully"
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isUpdated={isUpdated}
          setIsUpdated={setIsUpdated}
        />
      )}
      {isErrorOpen && (
        <ErrorModal
          label="Sending Email Failed"
          isAlertOpen={isErrorOpen}
          toggleModal={setIsErrorOpen}
          isEdit={isEdit}
          errorMessage={error}
        />
      )}
    </div>
  );
};

export default Appointment;
