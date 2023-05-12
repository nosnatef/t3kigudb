import { useState } from "react";

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <header className="flex justify-between bg-gradient-to-r from-[#ffcccc] to-#[cc99cc]-500 py-6 px-2 border-b border-gray-200">
        <p className="font-semibold font-sans">KiguDB</p>
        <button className="hover:bg-gray-200 rounded-lg" onClick={() => setShowMenu(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>

        </button>
      </header>
      <div
        onClick={() => setShowMenu(false)}
        className={`z-40 fixed inset-0 bg-gray-600 ${showMenu ? "bg-opacity-50" : "pointer-events-none bg-opacity-0"} h-full w-full transform ease-in-out transition-all duration-200`} >
      </div>
      <div className={`fixed top-0 right-0 h-full w-64 transition-transform transform ${showMenu ? "translate-x-0" : "translate-x-full"} bg-white z-50`}>
        <div
          className="flex flex-col py-4 px-4"
        >
          <div className="flex flex-row justify-between">
            <p className="font-semibold font-sans pl-2">KiguDB</p>
            <div className="hover:cursor-pointer hover:bg-gray-200 rounded-lg" onClick={() => setShowMenu(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          
          <div className="border-t border-gray-300 my-2"></div>
          <div className="h-10 bg-blue-600 text-gray-200 hover:cursor-pointer rounded-lg pl-2 py-2 flex items-center">
            Home
          </div>
          <div className="h-10 hover:bg-gray-100 hover:cursor-pointer rounded-lg pl-2 py-2 flex items-center">
            Random Kigu
          </div>
          <div className="h-10 hover:bg-gray-100 hover:cursor-pointer rounded-lg pl-2 py-2 flex items-center">
            Most Popular Characters
          </div>
          <div className="h-10 hover:bg-gray-100 hover:cursor-pointer rounded-lg pl-2 py-2 flex items-center">
            Recently Added Kigu
          </div>
          <div className="border-t border-gray-300 my-2"></div>
          <div className="h-10 hover:bg-gray-100 hover:cursor-pointer rounded-lg pl-2 py-2 flex items-center">Login</div>
          <div className="h-10 hover:bg-gray-100 hover:cursor-pointer rounded-lg pl-2 py-2 flex items-center">Sign Up</div>
          <div className="border-t border-gray-300 my-2"></div>
          <div className="h-10 hover:bg-gray-100 hover:cursor-pointer rounded-lg pl-2 py-2 flex items-center">
            <p className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">Add Kigu</p>
          </div>
          <div className="pl-2 fixed bottom-2 text-sm">Last Updated: 05-11-2023</div>
        </div>
      </div>

      
      
      {children}
    </section>
  );
}