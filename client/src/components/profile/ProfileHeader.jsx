// src/components/profile/ProfileHeader.jsx

import { FaEdit } from "react-icons/fa";

function ProfileHeader() {
  return (
    <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-[#08110A] via-[#102417] to-[#18452A] border border-green-900 p-5 sm:p-8 lg:p-10">

      <div className="absolute -top-10 -right-10 h-48 w-48 md:h-72 md:w-72 rounded-full bg-green-500 opacity-20 blur-3xl"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-6">

        <img
          src="https://i.pravatar.cc/300"
          alt="Profile"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-green-500 object-cover"
        />

        <div className="flex-1 text-center lg:text-left">

          <h1 className="text-2xl lg:text-5xl font-bold text-white">
            Frederick
          </h1>

          <p className="mt-2 text-sm lg:text-lg text-green-400">
            Full Stack Developer
          </p>

          <p className="mt-4 text-sm lg:text-base text-gray-300 max-w-xl">
            Passionate about building modern web applications using React,
            Node.js, Express and MongoDB.
          </p>

        </div>

        <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 px-5 py-3 rounded-xl font-semibold transition">

          <FaEdit />

          Edit Profile

        </button>

      </div>

    </section>
  );
}

export default ProfileHeader;