import React from "react";
import { ShoppingCartIcon, UserIcon } from "@heroicons/react/24/solid";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white fixed top-0 left-0 w-full shadow-md z-10">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Webshop</h1>

        <div className="flex items-center space-x-6">
        <button className="flex items-center hover:text-gray-200">
            <UserIcon className="h-6 w-6" />
          </button>
          <button className="flex items-center hover:text-gray-200">
            <ShoppingCartIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;