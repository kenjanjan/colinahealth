"use client";
import Image from "next/image";

import React, { useEffect } from "react";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/edit";
import { useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter } from "next/navigation";
import { fetchNotesByPatient } from "@/app/api/notes-api/notes-api";
import { SuccessModal } from "@/components/shared/success";
import { IncidentreportModalContent } from "@/components/modal-content/incidentreport-modal-content";
import Modal from "@/components/reusable/modal";
import Pagination from "@/components/shared/pagination";
import { ImageMinus } from "lucide-react";
import ResuableTooltip from "@/components/reusable/tooltip";
import PdfDownloader from "@/components/pdfDownloader";

const Notes = () => {
  const router = useRouter();
  if (typeof window === "undefined") {
  }
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("ASC");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [patientNotes, setPatientNotes] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalNotes, setTotalNotes] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState("");
  const [gotoError, setGotoError] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [term, setTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [isEdit, setIsEdit] = useState(false);
  const [notesToEdit, setNotesToEdit] = useState<any[]>([]);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const type = "ir";
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  console.log(params, "for surgery patientId");
  const patientId = params.id.toUpperCase();
  // const patientId = params.id;

  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const handleSortOptionClick = (option: string) => {
    setIsOpenSortedBy(false);
    if (option === "Subject") {
      setSortBy("subject");
    } else {
      setSortBy("notes");
    }
    console.log("option", option);
  };

  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Subject", onClick: handleSortOptionClick },
    { label: "Notes", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function

  const [isOpen, setIsOpen] = useState(false);

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setNotesToEdit([]);
      setIsEdit(false);
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

  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(e.target.value);
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchNotesByPatient(
          patientId,
          term,
          type,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          4,
          router,
        );
        setPatientNotes(response.data);
        setTotalPages(response.totalPages);
        setTotalNotes(response.totalCount);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortOrder, sortBy, term, isSuccessOpen]);

  console.log(patientNotes, "patientNotes");

  const onSuccess = () => {
    setIsSuccessOpen(true);
    setIsEdit(false);
  };

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
            <div className="flex gap-2">
              <p className="p-table-title">Notes</p>
              <p className="slash">{">"}</p>
              <p
                onClick={() => {
                  router.replace(
                    `/patient-overview/${patientId.toLowerCase()}/notes/nurses-notes`,
                  );
                  setIsLoading(true);
                }}
                className="bread"
              >
                Nurse&apos;s Notes
              </p>
              <p className="slash">{"/"}</p>
              <p className="active">Incident Report</p>
            </div>
            <div>
              <p className="h-[22px] w-[1157px] text-[15px] font-normal text-[#64748B]">
                Total of {totalNotes} Notes
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => isModalOpen(true)} className="btn-add gap-2">
              <Image src="/imgs/add.svg" alt="" width={22} height={22} />
              <p className="text-[18px]">Add</p>
            </button>
            <PdfDownloader
              props={[ "Uuid", "Date", "Time", "Subject", "Notes"]}
              variant={"Incident Report Table"}
              patientId={patientId}
            />
          </div>
        </div>

        <div className="m:rounded-lg w-full items-center">
          <div className="flex h-[75px] w-full items-center justify-between bg-[#F4F4F4]">
            <form className="relative mr-5">
              {/* search bar */}
              <label className=""></label>
              <div className="flex">
                <input
                  className="relative m-5 h-[47px] w-[573px] rounded bg-[#fff] bg-[573px] bg-no-repeat px-5 py-3 pl-10 pt-[14px] text-[15px] outline-none ring-[1px] ring-[#E7EAEE]"
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
                  width="20"
                  height="20"
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
                <td className="px-6 py-3">Notes UID</td>
                <td className="px-6 py-3">DATE</td>
                <td className="px-6 py-3">TIME</td>
                <td className="px-6 py-3">SUBJECT</td>
                <td className="px-6 py-3">DETAILS OF INCIDENT</td>
                <td className="px-6 py-3">REPORTED BY</td>
                <td className="w-[14px]"></td>
              </tr>
            </thead>
            <tbody className="h-[220px] overflow-y-scroll">
              {patientNotes.length === 0 && (
                <h1 className="border-1 absolute flex w-[180vh] items-center justify-center py-5">
                  <p className="text-center text-[15px] font-normal text-gray-700">
                    No Incident Report/s <br />
                  </p>
                </h1>
              )}
              {patientNotes.map((notes, index) => (
                <tr
                  key={index}
                  className="group border-b odd:bg-white even:bg-gray-50 hover:bg-[#f4f4f4]"
                >
                  <td className="px-6 py-3">
                    <ResuableTooltip text={notes.notes_uuid} />
                  </td>
                  <td className="px-6 py-3">
                    {new Date(notes.notes_createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    {new Date(notes.notes_createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-3">
                    <ResuableTooltip text={notes.notes_subject} />
                  </td>
                  <td className="px-6 py-3">
                    <ResuableTooltip text={notes.notes_notes} />
                  </td>
                  <td className="px-6 py-3">
                    <ResuableTooltip text="Ansel MD" />
                  </td>
                </tr>
              ))}
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
            <IncidentreportModalContent
              isModalOpen={isModalOpen}
              isOpen={isOpen}
              label={isEdit ? "Edit Note" : "Add Note"}
              onSuccess={onSuccess}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}

      {isSuccessOpen && (
        <SuccessModal
          label={isEdit ? "Edit Note" : "Add Note"}
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isUpdated={isUpdated}
          setIsUpdated={setIsUpdated}
        />
      )}
    </div>
  );
};

export default Notes;
