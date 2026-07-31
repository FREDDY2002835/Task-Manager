// src/components/profile/ProfileHeader.jsx

import { FaEdit } from "react-icons/fa";

function ProfileHeader({ user, onEditClick }) {
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
          src={user?.avatar || "https://i.pravatar.cc/300"}
          alt="Profile"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 object-cover"
          style={{
            borderColor: "var(--primary)",
          }}
        />


        <div className="flex-1 text-center lg:text-left">

          <h1 className="text-2xl lg:text-5xl font-bold text-white">
            {user?.name || "..."}
          </h1>


          {user?.title && (
            <p
              className="mt-2 text-sm lg:text-lg"
              style={{
                color: "var(--primary-light)",
              }}
            >
              {user.title}
            </p>
          )}


          {user?.bio && (
            <p className="mt-4 text-sm lg:text-base text-gray-300 max-w-xl">
              {user.bio}
            </p>
          )}


        </div>


        <button
          onClick={onEditClick}
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
