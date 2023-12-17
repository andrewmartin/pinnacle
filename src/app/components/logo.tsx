'use client';

import React from 'react';
import { TbReload } from 'react-icons/tb';

export const Logo = () => {
  return (
    <div className="flex p-6 absolute w-full top-0 left-0 justify-end opacity-[0.2]">
      <button
        onClick={() => {
          window.location.reload();
        }}
        className="flex items-center text-[1.2vw] text-gray-600 font-semibold uppercase space-x-2"
      >
        <span>Pinnacle</span> <TbReload size={10} />
      </button>
    </div>
  );
};
