import React from "react";

const MagicButton = ({ text }) => {
  return (
    <button
      className="
        group 
        w-40 h-20 rounded-full 
        bg-[#1C1A1C] 
        flex items-center justify-center gap-3
        transition-all duration-[450ms] ease-in-out
        hover:bg-gradient-to-t hover:from-[#A47CF3] hover:to-[#683FEA]
        hover:shadow-[inset_0px_1px_0px_rgba(255,255,255,0.4),
                     inset_0px_-4px_0px_rgba(0,0,0,0.2),
                     0px_0px_0px_4px_rgba(255,255,255,0.2),
                     0px_0px_180px_0px_#9917FF]
        hover:-translate-y-1
      "
    >
      <svg
        height="24"
        width="24"
        viewBox="0 0 24 24"
        className="fill-gray-400 group-hover:fill-white transition-all duration-[800ms] group-hover:scale-110"
      >
        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
      </svg>

      <span className="text-gray-400 font-semibold text-md group-hover:text-white">
        {text}
      </span>
    </button>
  );
};

export default MagicButton;
