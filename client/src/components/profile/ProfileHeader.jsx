// src/components/profile/ProfileHeader.jsx

import { FaEdit } from "react-icons/fa";

function ProfileHeader() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl lg:rounded-3xl border border-gray-700 p-5 sm:p-8 lg:p-10"
      style={{
        background:
          "linear-gradient(to right, #08110A, #102417, var(--primary-dark))",
      }}
    >

      <div
        className="absolute -top-10 -right-10 h-48 w-48 md:h-72 md:w-72 rounded-full opacity-20 blur-3xl"
        style={{
          background: "var(--primary)",
        }}
      ></div>


      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-6">

        <img
          src="https://i.pravatar.cc/300"
          alt="Profile"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 object-cover"
          style={{
            borderColor: "var(--primary)",
          }}
        />


        <div className="flex-1 text-center lg:text-left">

          <h1 className="text-2xl lg:text-5xl font-bold text-white">
            Frederick
          </h1>


          <p
            className="mt-2 text-sm lg:text-lg"
            style={{
              color: "var(--primary-light)",
            }}
          >
            Full Stack Developer
          </p>


          <p className="mt-4 text-sm lg:text-base text-gray-300 max-w-xl">
            Passionate about building modern web applications using React,
            Node.js, Express and MongoDB.
          </p>


        </div>


        <button
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-5 py-3 rounded-xl font-semibold transition text-white"
          style={{
            background: "var(--primary)",
          }}
        >

          <FaEdit />

          Edit Profile

        </button>


      </div>

    </section>
  );
}

export default ProfileHeader;