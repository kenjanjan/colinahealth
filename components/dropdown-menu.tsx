import React, { useEffect, useRef, useState } from "react";

interface DropdownMenuProps {
  open: boolean;
  width: string;
  label: string;
  options: { label: string; onClick: () => void }[];
}

const DropdownMenu = ({ open, width, label, options }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {

      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleOptionClick = (onClick: () => void) => {
    onClick(); // Execute the onClick function of the option
    setIsOpen(false); // Close the dropdown after the option is clicked
  };


  return (
    <div className={`w-full max-w-[165px] w-${width}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#FFFFFF] relative w-full h-[47px] rounded-[5px] px-[20px] items-center flex justify-between font-semibold opacity-[60%]"
      >
        {label}
        <img src="/imgs/dropdown.svg" alt="" />
      </button>

      {isOpen && (
        <div className=" bg-white w-[165px] absolute mt-2 rounded-md p-4 shadow-xl">
          {options.map((option, index) => (
            <p
              className="hover:text-[#007C85] font-semibold"
              key={index}
              onClick={() => handleOptionClick(option.onClick)}
            >
              {option.label}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
