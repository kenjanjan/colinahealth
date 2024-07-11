import Link from "next/link";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SeeAll = ({ className, url, isHovered }: any) => {
  return (
    <Link href={url?url:"/"}>
      <div
        className={cn(`sub-title absolute bottom-3 flex`, className)}
      >
        See All
        <Image
          src="/icons/see-all-icon.svg"
          alt="dropdown"
          width={17}
          height={14}
        />
      </div>
    </Link>
  );
};

export default SeeAll;
