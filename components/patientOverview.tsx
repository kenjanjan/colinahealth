"use client";
import { useEffect, useRef, useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { Navbar } from "@/components/navbar";
import { redirect, useParams, useRouter } from "next/navigation";
import { fetchPatientOverview } from "@/app/api/patients-api/patientOverview.api";
import { usePathname } from "next/navigation";
import {
  fetchPatientProfileImage,
  updatePatientProfileImage,
} from "@/app/api/patients-api/patientProfileImage.api";

import { toast as sonner } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import Image from "next/image";
import {
  EditProvider,
  useEditContext,
} from "@/app/(routes)/patient-overview/[id]/editContext";
import { PatientOverviewProps } from "@/lib/interface";

export default function PatientOverviewComponent({
  isCollapsed,
  onOpenHoverEnter,
  onOpenHoverLeave,
  toggleSidebar,
  isOpenHovered,
}: PatientOverviewProps) {
  const { isEdit, isSave, toggleEdit, disableEdit } = useEditContext();

  useEffect(() => {
    console.log("isEdit changed in layout:", isEdit);
  }, [isEdit]);

  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const { toast } = useToast();
  const [patientData, setPatientData] = useState<any[]>([]);
  const [patientImage, setPatientImage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const patientId = params.id.toUpperCase();
  const pathname = usePathname();
  const inputRef = useRef<HTMLSpanElement>(null);

  const tabs = [
    {
      label: "MAR",
      url: `/patient-overview/${params.id}/medication/scheduled`,
    },
    {
      label: "Notes",
      url: `/patient-overview/${params.id}/notes/nurses-notes`,
    },
    {
      label: "Vital Signs",
      url: `/patient-overview/${params.id}/vital-signs`,
    },
    {
      label: "Laboratory Results",
      url: `/patient-overview/${params.id}/lab-results`,
    },
    {
      label: "Medical History",
      url: `/patient-overview/${params.id}/medical-history/allergies`,
    },
    {
      label: "Prescription",
      url: `/patient-overview/${params.id}/prescription`,
    },
    {
      label: "Forms",
      url: `/patient-overview/${params.id}/forms`,
    },
    {
      label: "Appointment",
      url: `/patient-overview/${params.id}/patient-appointment`,
    },
  ];
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const [currentRoute, setCurrentRoute] = useState<string>("");

  const [seeMoreClicked, setSeeMoreClicked] = useState(false);
  const [seeMoreHovered, setSeeMoreHovered] = useState(false);

  const handleSeeMoreHover = () => {
    setSeeMoreHovered(true);
  };

  const handleSeeMoreLeave = () => {
    setSeeMoreHovered(false);
  };

  useEffect(() => {
    const pathParts = pathname.split("/");
    setCurrentRoute(pathParts[pathParts.length - 1]);
    const clicked = true;
    const hovered = true;
    setSeeMoreClicked(clicked);
    setSeeMoreHovered(hovered);
  }, [pathname, currentRoute]);

  //show loading
  const loadDefaultImage = async () => {
    try {
      // Fetch the default image as a file
      const response = await fetch("/imgs/loading.gif");
      const blob = await response.blob();

      // Read the file content as a data URL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPatientImage(reader.result); // Set the data URL as the state
        }
      };
      reader.readAsDataURL(blob); // Read the blob content as a data URL
    } catch (error) {
      console.error("Error loading default image:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetchPatientOverview(patientId, router);
      console.log(response, "response");
      const imgResponse = await fetchPatientProfileImage(patientId, router);
      setIsLoading(false);

      if (!imgResponse.data || imgResponse.data.length === 0) {
        // If no image data is available, set patientImage to null
        setPatientImage("");
      } else {
        // Convert the image data buffer to a data URL
        const buffer = Buffer.from(imgResponse.data);
        const dataUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;
        setPatientImage(dataUrl);
      }
      setPatientData(response);
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
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
    }
  };
  useEffect(() => {
    const pathParts = pathname.split("/");
    const tabUrl = pathParts[pathParts.length - 1];

    fetchData();
  }, [patientId, router, params]);
  //removed router and params replaced with pathname for reduce icon reload
  console.log(patientData, "patientData");

  const pathParts = pathname.split("/");
  const tabUrl = pathParts[pathParts.length - 1];

  const handleCopyClick = () => {
    if (inputRef.current) {
      sonner.success("Patient ID copied to clipboard");
      const range = document.createRange();
      range.selectNodeContents(inputRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand("copy");
      selection?.removeAllRanges();
    }
  };
  const toggleMaxSizeToast = (): void => {
    toast({
      variant: "destructive",
      title: "File Size Too Big!",
      description: `Total size of selected files exceeds the limit of 15MB!`,
    });
  };
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const MAX_FILE_SIZE_MB = 15;

    if (!files || files.length === 0) {
      // No files selected, handle accordingly
      console.warn("No files selected");
      return;
    }

    const totalSize: number = Array.from(files).reduce(
      (acc, file) => acc + (file?.size || 0), // Check for null file and size
      0,
    );
    const totalSizeMB = totalSize / (1024 * 1024); // Convert bytes to MB

    if (totalSizeMB > MAX_FILE_SIZE_MB) {
      toggleMaxSizeToast();
      e.target.value = ""; // Clear the input field
      return;
    }

    const reader = new FileReader(); // Create a new FileReader instance

    // Define an onload function for the reader
    reader.onload = () => {
      // Check if reader.result is a string
      if (typeof reader.result === "string") {
        // When the reader finishes loading the file and the result is a string, update the patientImage state with the data URL of the selected image
        setPatientImage(reader.result);
      }
    };

    // Read the selected file as a data URL
    if (files[0]) {
      reader.readAsDataURL(files[0]);
    } else {
      console.warn("No valid file selected");
    }

    // Handle other file details
    const newFiles: File[] = [];
    const newFileNames: string[] = [];
    const newFileTypes: string[] = [];

    Array.from(files).forEach((file) => {
      if (file) {
        // Add file, name, and type to arrays
        newFiles.push(file);
        newFileNames.push(file.name);
        newFileTypes.push(file.type.split("/")[1]);
      }
    });

    setSelectedFile(newFiles);
    setSelectedFileNames(newFileNames);
    setFileNames(newFileNames);
    setFileTypes(newFileTypes);
  };

  //save button
  useEffect(() => {
    if (isSave) {
      handleSubmit();
      toggleEdit();
    }
  }, [isSave]);

  const handleSubmit = async () => {
    console.log("submitting");
    try {
      if (selectedFile) {
        // Iterate through each selected file
        for (let i = 0; i < selectedFile.length; i++) {
          const userIconFormData = new FormData();
          userIconFormData.append(
            "profileimage",
            selectedFile[i],
            fileNames[i],
          );

          // Add lab file
          const addUserIcon = await updatePatientProfileImage(
            patientId,
            userIconFormData,
          );
          setIsLoading(true);

          loadDefaultImage(); // Call the function to load the default image
          fetchData();

          console.log(
            `Icon FILE ${fileNames[i]} added successfully:`,
            addUserIcon,
          );
        }
      } else {
        console.warn("No files selected to upload");
      }
      // onSuccess();
      // isModalOpen(false);
    } catch (error: any) {
      if (error.message === "Patient already exist") {
        console.log("conflict error");
      }
      console.log(error.message);
      setError("Failed to add Patient");
    }
  };
  return (
    <div className="flex w-full flex-col gap-[3px]">
      <div className="p-title relative flex gap-1 pb-2">
        <div
          className={`flex items-center gap-5 transition-opacity duration-300 delay-150 cursor-pointer ${isCollapsed ? "opacity-100 block" : "hidden opacity-0"}`}
          onMouseEnter={onOpenHoverEnter}
          onMouseLeave={onOpenHoverLeave}
          onClick={toggleSidebar}
        >
          <Image
            className="ml-1"
            src="/icons/sidebar-open.svg"
            alt="sidebar-open"
            width={20}
            height={20}
          />
        </div>

        <h1>Patient Overview</h1>
        <div
          className={`absolute left-[2%] -mt-1 rounded-[5px] bg-[#007C85] px-3 py-2 !text-[15px] text-white transition-all duration-100 ${isOpenHovered ? "scale-100" : "scale-0"}`}
        >
          <h1>OPEN</h1>
        </div>
      </div>
      <div className="flex w-full gap-[30px] rounded-md p-5 ring-1 ring-[#D0D5DD]">
        <div className="relative">
          {!isLoading ? (
            <>
              {patientImage ? (
                <Image
                  className="max-h-[200px] min-h-[200px] min-w-[200px] max-w-[200px] rounded-md object-cover"
                  width={200}
                  height={200}
                  src={patientImage}
                  alt="profile"
                />
              ) : (
                <Image
                  className="max-h-[200px] min-h-[200px] min-w-[200px] max-w-[200px] rounded-md object-cover"
                  width={200}
                  height={200}
                  src="/imgs/user-no-icon.svg"
                  alt="profile"
                />
              )}
            </>
          ) : (
            <div className="h-[200px] w-[200px] animate-pulse rounded-lg bg-gray-300"></div>
          )}
          {currentRoute === "patient-details" && isEdit && (
            <label
              htmlFor="fileInput"
              className="absolute bottom-2 right-[-20px] cursor-pointer"
            >
              <Image
                src="/svgs/editprof.svg"
                alt="edit button"
                width={35}
                height={35}
              />
            </label>
          )}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex w-full justify-between">
          <div className="flex flex-col justify-between gap-[20px] pt-[10px]">
            <div className="flex flex-col gap-[15px]">
              {isLoading ? (
                <div className="h-[30px] w-52 animate-pulse rounded-full bg-gray-300"></div>
              ) : (
                <p className="p-title ml-1">
                  {patientData[0]?.firstName} {patientData[0]?.middleName}{" "}
                  {patientData[0]?.lastName}
                </p>
              )}
              <div className="flex flex-col gap-[15px]">
                <div className="flex gap-[55px]">
                  {isLoading ? (
                    <div className="flex animate-pulse items-start">
                      <div className="mr-2 h-[22px] w-32 rounded-full bg-gray-300"></div>
                      <div className="mr-2 h-[22px] w-24 rounded-full bg-gray-400"></div>
                      <div className="mr-2 h-[22px] w-36 rounded-full bg-gray-300"></div>
                      <div className="mr-2 h-[22px] w-36 rounded-full bg-gray-200"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-[3px]">
                        <img
                          src="/imgs/profile-circle-new.svg"
                          className="px-1"
                          alt="profile"
                          width="26"
                          height="26"
                        />
                        <p className="">Patient</p>
                      </div>
                      <p className="">Age: {patientData[0]?.age}</p>
                      <p className=" ">Gender: {patientData[0]?.gender}</p>
                      <div className="flex gap-[8px]">
                        <p className="flex items-center">
                          ID: <span ref={inputRef}>{patientData[0]?.uuid}</span>
                        </p>
                        <img
                          src="/imgs/id.svg"
                          alt="copy"
                          className="cursor-pointer"
                          onClick={handleCopyClick}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-[35px]">
                  {isLoading ? (
                    <div className="flex animate-pulse items-start">
                      <div className="mr-12 h-5 w-44 rounded-full bg-gray-400"></div>
                      <div className="h-5 w-60 rounded-full bg-gray-400"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex w-[212px] gap-[3px]">
                        <img
                          src="/imgs/codestatus.svg"
                          className="px-1"
                          alt="codestatus"
                          width="26"
                          height="26"
                        />
                        <p>
                          Code Status:
                          <span
                            className={` ${
                              patientData[0]?.codeStatus === "DNR"
                                ? "text-red-500"
                                : "text-blue-500"
                            } ml-1 w-[100px]`}
                          >
                            {patientData[0]?.codeStatus}
                          </span>
                        </p>
                      </div>
                      <p className="flex">
                        Allergy:{" "}
                        {patientData[0]?.allergies
                          ? patientData[0]?.allergies
                          : "None"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-[50px] px-2">
              {isLoading ? (
                <div className="flex animate-pulse items-start">
                  <div className="mr-12 h-8 w-10 rounded-full bg-gray-300"></div>
                  <div className="mr-12 h-8 w-14 rounded-full bg-gray-200"></div>
                  <div className="mr-12 h-8 w-20 rounded-full bg-gray-300"></div>
                  <div className="mr-12 h-8 w-36 rounded-full bg-gray-400"></div>
                  <div className="mr-12 h-8 w-28 rounded-full bg-gray-300"></div>
                  <div className="mr-12 h-8 w-24 rounded-full bg-gray-200"></div>
                  <div className="mr-12 h-8 w-14 rounded-full bg-gray-400"></div>
                  <div className="h-8 w-24 rounded-full bg-gray-200"></div>
                </div>
              ) : (
                tabs.map((tab, index) => (
                  <Link href={tab.url} key={index}>
                    <p
                      className={`cursor-pointer font-bold ${
                        pathname === tab.url ||
                        (tabUrl === "surgeries" &&
                          tab.label === "Medical History") ||
                        (tabUrl === "prorenata" && tab.label === "MAR") ||
                        (tabUrl === "incident-report" &&
                          tab.label === "Notes") ||
                        (tabUrl === "archived" && tab.label === "Forms")
                          ? "border-b-2 border-[#007C85] pb-1 text-[15px] text-[#007C85]"
                          : "h-[31px] border-[#007C85] pb-1 text-[15px] hover:border-b-2 hover:text-[#007C85]"
                      }`}
                      onClick={() => {
                        disableEdit(); // disable edit on tab change
                      }}
                    >
                      {tab.label}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className={`cursor-pointer ${isLoading ? "hidden" : ""}`}>
            <Link href={`/patient-overview/${params.id}/patient-details`}>
              <p
                onClick={() => {}}
                className={`mr-10 text-right text-[15px] font-semibold underline hover:text-[#007C85] ${
                  currentRoute === "patient-details" ? "text-[#007C85]" : ""
                }`}
                onMouseEnter={handleSeeMoreHover}
                onMouseLeave={handleSeeMoreLeave}
              >
                See more details
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
