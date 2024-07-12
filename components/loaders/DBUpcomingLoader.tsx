const DBUpcomingLoader = () => {
  return (
    <div className="flex h-[360px] w-full flex-col items-start gap-5 rounded-[5px] bg-[#FAFAFA] px-5 py-3">
      <div className="p-title mr-2 h-[30px] w-[250px] rounded-full !font-medium">
        Upcoming Appointments
      </div>
      <div className="sub-title -mt-2 w-full text-[15px] font-normal">
        Total of 0 upcoming appointment
      </div>
      <div className="flex h-full w-full animate-pulse flex-col gap-[23px]">
        <div className="flex w-full items-center">
          <div className="min-h-[50px] min-w-[50px] rounded-full bg-gray-300"></div>
          <div className="flex w-full flex-row justify-between gap-2">
            <div className="flex w-full flex-col gap-2">
              <div className="mr-2 h-[22px] w-[200px] rounded-full bg-gray-200"></div>
              <div className="mr-2 h-[22px] w-36 rounded-full bg-gray-200"></div>
            </div>
            <div className="flex flex-col items-end justify-end gap-2">
              <div className="mr-2 h-[22px] w-36 rounded-full bg-gray-200"></div>
              <div className="mr-2 h-[22px] w-20 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center">
          <div className="min-h-[50px] min-w-[50px] rounded-full bg-gray-300"></div>
          <div className="flex w-full flex-row justify-between gap-2">
            <div className="flex w-full flex-col gap-2">
              <div className="mr-2 h-[22px] w-[200px] rounded-full bg-gray-200"></div>
              <div className="mr-2 h-[22px] w-36 rounded-full bg-gray-200"></div>
            </div>
            <div className="flex flex-col items-end justify-end gap-2">
              <div className="mr-2 h-[22px] w-36 rounded-full bg-gray-200"></div>
              <div className="mr-2 h-[22px] w-20 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center">
          <div className="min-h-[50px] min-w-[50px] rounded-full bg-gray-300"></div>
          <div className="flex w-full flex-row justify-between gap-2">
            <div className="flex w-full flex-col gap-2">
              <div className="mr-2 h-[22px] w-[200px] rounded-full bg-gray-200"></div>
              <div className="mr-2 h-[22px] w-36 rounded-full bg-gray-200"></div>
            </div>
            <div className="flex flex-col items-end justify-end gap-2">
              <div className="mr-2 h-[22px] w-36 rounded-full bg-gray-200"></div>
              <div className="mr-2 h-[22px] w-20 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-fit cursor-pointer items-center text-[15px] font-semibold text-[#151518] opacity-50 hover:text-[#007C85] hover:opacity-100">
        SEE ALL UPCOMING APPOINTMENTS
        <svg
          className="ml-2 text-[#71717A] group-hover:text-[#007C85]"
          width="17"
          height="14"
          viewBox="0 0 10 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.14795 2.15826L8.7739 8.78421L2.14795 15.4102"
            stroke="currentColor"
            strokeWidth="2.43402"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default DBUpcomingLoader;
